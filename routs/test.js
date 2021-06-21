var express        = require("express");
var app            = express();
var router         = express.Router();
var User           = require("../models/user");
var Exam           = require("../models/exam");
var Notice         = require("../models/notice");
var formidable     = require('formidable');
var fileUpload     = require('express-fileupload');
var fs             = require('fs');
var path           = require('path');


router.get("/author/exam/new",isLoggedIn,function(req,res){

     if(req.user.isAuthor){
      Notice.find({},function(err,notices){
        if (err){
          console.log(err);
        }else{
          res.render("create_test",{user: req.user,notices: notices});
        };
      });
          
        }else{
          res.redirect("/");
        };

}); 

router.post("/new-test",isLoggedIn,function(req,res){

Exam.create({
  subject: req.body.subject,
  class: req.body.class,
  section: req.body.section,
  author: {
    id: req.user._id,
    username: req.user.username
  },
  question_title: req.body.question_title,
  question_img_url: req.body.question_img,
  question_description: req.body.question_description
},function(err,test){
  if (err) {
    console.log(err);
  }
console.log(test);
res.redirect("/author/dashboard")

})


});

router.get("/edit/test/:id",isLoggedIn,function(req,res){
 Exam.findById(req.params.id,function(err,test){
  if(err){
    console.log(err);
    res.send("something went wrong");
  }


  Notice.find({},function(err,notices){
    if(err){
      console.log(err)
    }
    res.render("edit_test",{test:test,notices:notices,user: req.user})
    console.log(test)
  })



 })
})

router.post("/edit-test/:testId",isLoggedIn,function(req,res){
   
   var newTest = {
  subject: req.body.subject,
  class: req.body.class,
  section: req.body.section,
  author: {
    id: req.user._id,
    username: req.user.username
  },
  question_title: req.body.question_title,
  question_img_url: req.body.question_img,
  question_description: req.body.question_description
};

   Exam.findByIdAndUpdate(req.params.testId,newTest,{new:true},function(err,test){
    if(err){
      console.log(err);

       req.flash('wrong', 'Something went wrong');
       res.redirect('/author/dashboard');
    }
    req.flash('info', 'Successfully Edited');
    res.redirect('/author/dashboard');

   })

})



function isLoggedIn(req,res,next){ // 
  if(req.isAuthenticated()){      //   this function used for preventing   
    return next();               //   a logged out user to visite   
  }else{  
    req.flash('loginFirst', 'Please Login First');  
    res.redirect("/login");             
  }
}


function isLoggedOut(req,res,next){ //                       
  if(!req.isAuthenticated()){      //  this function used for preventing       
    return next();                //  a logged in user to visite       
  }else{                         //  the login and registaion page
    res.redirect("/");          //           
  }
}


function moveFile(img,user,p){
  console.log(user);

   img.mv(path.join('./public/uploads/' + user, p), function(err){

        if (err){
         console.log(err);
        }        
        console.log('File uploaded!');
    });
}




module.exports = router;