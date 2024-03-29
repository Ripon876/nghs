var express        = require("express");
var app            = express();
var router         = express.Router();
var User           = require("../models/user");
var Exam           = require("../models/exam");
var Answer         = require("../models/answer");
var Notice         = require("../models/notice");
var Message        = require("../models/message");
var formidable     = require('formidable');
var fileUpload     = require('express-fileupload');
var fs             = require('fs');
var path           = require('path');
var middlewares    = require("../middlewares/middleware");


/*
router.use(function(req,res,next){
    res.locals.messages          = [];
    next();
})
*/

router.use(function(req,res,next){

if (!req.user) {
    res.locals.messages          = [];
    next();
}else{

  if(req.user.isAuthor && !req.user.isAdmin){
   res.locals.messages          = [];
    next();
  }else{

    Message.find({},function(err,ns){
    if(err)console.log(err);
var messages = [];
    if (req.user) {

ns.forEach( function(msg) {
 if(msg.to.user.class === req.user.class && msg.to.user.section === req.user.section && msg.to.user.id === req.user._id){
   messages.push(msg);
   }
});

  res.locals.messages = messages;
  next();  

    }else{
     res.locals.messages = [];
     next(); 
    }


});
  }

}




})

router.get("/author/exam/new",middlewares.isLoggedInAndAuthor,function(req,res){

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

router.post("/new-test",middlewares.isLoggedInAndAuthor,function(req,res){

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

res.redirect("/author/dashboard")

})


});

router.get("/edit/test/:id",middlewares.isLoggedInAndAuthor,function(req,res){
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
  
  })



 })
})

router.get("/delete_test/:test_id",middlewares.isLoggedInAndAuthor,function(req,res){
  Exam.findByIdAndRemove(req.params.test_id,function(err,test){
    if(err){
      console.log(err);
      req.flash("wrong","Something Went Wrong");
      res.redirect("/author/dashboard");
    }

  req.flash("info","Test Successfully Deleted");
  res.redirect("/author/dashboard");
  // console.log(req.params.test_id,test)
   

  });
})

router.post("/edit-test/:testId",middlewares.isLoggedInAndAuthor,function(req,res){
   
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

   });

});

router.get("/test/status/:test_id",middlewares.isLoggedInAndAuthor,function(req,res){
var answersOfTheTest = {
  test_id: req.params.test_id
}

Answer.find(answersOfTheTest,function(err,answers){
  if(err)
  {
    console.log(err);
    res.redirect("/author/dashboard");
  }

 Notice.find({},function(err,notices){
    if(err){
      console.log(err)
    }
    res.render("test_status",{notices:notices,user: req.user,answers:answers});
    // console.log("==============")
  });



});
});

router.get("/test/status/answer/:answer_id",middlewares.isLoggedInAndAuthor,function(req,res){

  Answer.findById(req.params.answer_id,function(err,answer){
    if(err){
      console.log(err);
    }
    
    var ansObj ={
      answer: answer
    }

    res.json(ansObj);


  })
});

router.get("/test/result/answer/:answer_id/:number",middlewares.isLoggedInAndAuthor,function(req,res){
var id = req.params.answer_id;
var status = false;
if(req.params.number >= 33){
  status = true;
}

var e = true;

  var result = {
    marks: req.params.number,
    passed: status
  }
  var error = {
    message: "error"
  }
  var success = {
    message: "success"
  }

Answer.find({},function(err,anss){
  if (err) {
    console.log(err);
    res.send(error);
  }
  
  anss.forEach(function(ans) {
    if(String(ans._id) === id){
      e = false;
      updateResult(id,result);
  
    };    
  }); 
 

if (e === true) {
   res.send(error);
}
   
});

 
function updateResult(id,result){
   Answer.findByIdAndUpdate(id,result,{new: true},function(err,answer){
  if(err){
    console.log(err);
  }
   e = false;
   res.json(success)


  });
}

})

router.get("/test/:answer_id/:test_id/result",middlewares.isLoggedIn,function(req,res){

var obj={
    _id: req.params.answer_id,
    test_id: req.params.test_id,
  }


 Answer.find(obj,function(err,answer){
  if(err){
    console.log(err);
    res.send("something went wrong");
  }
  // console.log(answer)
  // res.send(answer)
  res.render("see_result",{answer: answer,user: req.user});

 })
 

});



module.exports = router;