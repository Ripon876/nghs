var express        = require("express");
var app            = express();
var router         = express.Router();
var User           = require("../models/user");
var Exam           = require("../models/exam");
var Answer         = require("../models/answer");
var Notice         = require("../models/notice");
var Live_Class     = require("../models/live_class_schedule");
var fileUpload     = require('express-fileupload');
var flash          = require('connect-flash');
var fs             = require('fs');
var path           = require('path');
var middlewares    = require("../middlewares/middleware");


router.use(function(req,res,next){

  res.locals.currenUser    = req.user;
  res.locals.user          = req.user;
  res.locals.error         = req.flash("error");
  res.locals.success       = req.flash("success");
  res.locals.notification  = req.flash("notification");

Notice.find({},function(err,ns){
    if(err)console.log(err);

    if (req.user) {
var notices = [];
ns.forEach( function(notice) {
 if(notice.class === req.user.class && notice.section === req.user.section  || notice.notice_type === "normal"){
   notices.push(notice);
   }
});
  res.locals.notices = notices;
  next();    
    }else{
     res.locals.notices = [];
     next(); 
    }


});



});





router.get("/user/dashboard",middlewares.isLoggedIn,function(req,res){
  var title = "NGHS | User Dashboard";
  var obj = {
  class: req.user.class,
  section: req.user.section
}
var usreAnswers = {
  user: {
      id: req.user._id,
      username: req.user.username,
      name: req.user.name
  }
}


    User.findById(req.user._id,function(err,user){
      if (err) {
        console.log(err)
      }else{

        Notice.find({},function(err,notices){
          if (err) {
            console.log(err);
          }
          else{
            Exam.find(obj,function(err,tests){
              if(err){
                console.log(err);
              }

              Answer.find(usreAnswers,function(err,answers){
                if(err){
                  console.log(err);
                }
                 res.render("user_dashborad",{answers: answers,user: user,title: title,tests: tests,success: req.flash("submissionDone"),error: req.flash("submissionFailed"),notification: req.flash("notification")});
              })


            }) 
          }
        });
      }
    });
});



router.get("/user/profile",middlewares.isLoggedIn,function(req,res){
  var title = "NGHS | User Profile";
  User.findById(req.user._id,function(err,user){
    if (err) {
      console.log(err)
    }else{
        res.render("user_profile",{title: title,user: user});
    }
  });

});


router.get("/user/profile/edit",middlewares.isLoggedIn,function(req,res){
  var title = "NGHS | Edit Profile";
  User.findById(req.user._id,function(err,user){
    if (err) {
      console.log(err)
    }else{
            Notice.find({},function(err,notices){
        if (err){
          console.log(err);
        }else{
         res.render("edit_profile",{title: title,user: user});          
        };
      });

    }
  });
 
});


router.put("/user/profile",middlewares.isLoggedIn,function(req,res){

   var user = req.body.user;
   User.findByIdAndUpdate(req.user._id,user,{new: true},function(err,user){
     if (err) {
      console.log(err)
     }else{
        // console.log(user);
        if (req.user.isAdmin) {
           res.redirect("/admin");
        }else if(req.user.isAuthor){
            res.redirect("/author/dashboard");
        }else {
            res.redirect("/user/dashboard");
        }
       
     };
   });

});


router.get("/user/liveclasses",middlewares.isLoggedIn,function(req,res){

var findObj = {
  class: req.user.class,
  section: req.user.section,
}

Live_Class.find(findObj,function(err,classes){
  if(err){
    req.flash("submissionFailed", 'Something went wrong');  
    res.redirect("/user/dashboard");  
  }else{
    res.render("live_classes",{classes : classes});
  }
})

})

module.exports = router;