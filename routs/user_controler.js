var express        = require("express");
var app            = express();
var router         = express.Router();
var User           = require("../models/user");
var Exam           = require("../models/exam");
var Answer         = require("../models/answer");
var Notice         = require("../models/notice");
var Message        = require("../models/message");
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
var notices = [];
    if (req.user) {

ns.forEach( function(notice) {
 if((notice.class === req.user.class && notice.section === req.user.section ) || notice.notice_type === "normal"){
   notices.push(notice);
   }
});
  res.locals.notices = notices;
   




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


     
    }else{
     res.locals.notices = [];
     next(); 
    }


});






});





router.get("/user/dashboard",middlewares.isLoggedInAndOnlyUser,function(req,res){
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


router.get("/user/liveclasses",middlewares.isLoggedInAndOnlyUser,function(req,res){

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


router.get("/user/notice/:notice_id",middlewares.isLoggedIn,function(req,res){




Notice.findById(req.params.notice_id,function(err,notice){
  if(err){
    console.log(err);
  }


if(notice === null){
res.render("show_class_notice_info",{error: "Invalid Request",cls: ''});
}else if(notice.notice_type === "normal"){
 res.render("show_notice_info",{notice: notice});

 }else {


var s = notice.notice.split(/[\s,]+/);
      
 
Live_Class.findById(s[s.length - 1],function(err,cls){
 

if(err) console.log(err);

if(cls === null){

Notice.findByIdAndRemove(notice._id,function(err,done) {
 if (err) {console.log(err)};
  res.render("show_class_notice_info",{error: "This class has been removed",cls: ''});

})

}else{
    res.render("show_class_notice_info",{cls: cls});
}
   

  

})
      

 } 

})
 
});



router.get("/user/messages/:messagesID",middlewares.isLoggedInAndOnlyUser,function(req,res) {
  
Message.findById(req.params.messagesID,function(err,message){
  if(err){
    console.log(err);
    res.render("404");
  }


if(message === null){
res.render("see_message",{error: "Message not found",message: ''});
}else{
    res.render("see_message",{message: message});
}
   

  

})
})
      







module.exports = router;