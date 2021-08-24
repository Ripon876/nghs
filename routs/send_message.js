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
 if( notice.notice_type === "normal"){
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


router.get("/author/send-message",middlewares.isLoggedInAndAuthor,function(req,res){
  res.render("send_message");
})



 module.exports = router;
