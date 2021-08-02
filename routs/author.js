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

router.use(function(req,res,next){

  res.locals.currenUser    = req.user;
  res.locals.user          = req.user;
  Notice.find({},function(err,notices){
  	if(err)console.log(err);
res.locals.notices = notices;

  })

  res.locals.error         = req.flash("error");
  res.locals.success       = req.flash("success");
  res.locals.notification  = req.flash("notification");




  next();
});

 router.get("/author/hostLiveClass",isLoggedIn,function(req,res) {

var sss = {
	id: req.user._id,
	name: req.user.name
}

Live_Class.find({author: sss},function(err,clas){
	if(err)console.log(err);


 Notice.find({},function(err,notices){
  if(err)console.log(err);
  res.render("host_class",{user: req.user,notices: notices,classes: clas, success : req.flash("successfully_schedule_deleted"),error: req.flash("successfully_schedule_not_deleted")});
 });


});
 

 	
 })

 router.post("/author/hostLiveClass",isLoggedIn,function(req,res) {
var live_class = {
class_date: req.body.class_date,
class_time: req.body.class_time,
class: req.body.class,
section:req.body.section,
subject: req.body.subject,
meeting_link: req.body.meeting_link,
author: {
	id: req.user._id,
	name: req.user.name
}
}

Live_Class.create(live_class,function(err,clas){
	if(err) console.log(err); 


  var notice = {
    notice: `${req.body.subject} - Live class - Class ${req.body.class} - Section ${req.body.section} - ID: ${clas._id}`,
    user: {
    	id: req.user._id,
      name: req.user.name
    },
    notice_type: "class"
  }
  Notice.create(notice,function(err,notice){
    if (err) {
      console.log(err);
    }else{
    // console.log(notice);
    // res.redirect("/admin/notice");
        res.json({mes: clas})
    };
  });




});
 	
 })


router.get("/author/hostLiveClass/remove/:id",function(req,res){
	var id  = req.params.id;
	Live_Class.findByIdAndRemove(id,function(err,cls){
		if(err){
			console.log(err);
	    req.flash("successfully_schedule_not_deleted","Schedule not deleted successfully");
		res.redirect("/author/hostLiveClass");
         }


		
		req.flash("successfully_schedule_deleted","Schedule deleted successfully");
		res.redirect("/author/hostLiveClass");
	})
})



router.get("/user/notice/:notice_id",isLoggedIn,function(req,res){




Notice.findById(req.params.notice_id,function(err,notice){
	if(err){
		console.log(err);
	}

 if(notice.notice_type === "normal"){
 	res.send("the given notice is normal");
 }else {

var s = notice.notice.split(/[\s,]+/);

			
 
Live_Class.findById(s[s.length - 1],function(err,cls){
	

if(err) console.log(err)
	
	res.render("show_notice_info",{cls: cls});
	
})
			

 }

})
 
})
 module.exports = router;


function isLoggedIn(req,res,next){ // 
  if(req.isAuthenticated()){      //   this function used for preventing   
    return next();               //   a logged out user to visite   
  }else{  
    req.flash('loginFirst', 'Please Login First');  
    res.redirect("/login");             
  }
}

