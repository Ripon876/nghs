var express        = require("express");
var app            = express();
var router         = express.Router();
var User           = require("../models/user");
var Exam           = require("../models/exam");
var Answer         = require("../models/answer");
var Notice         = require("../models/notice");
var formidable     = require('formidable');
var fileUpload     = require('express-fileupload');
var fs             = require('fs');
var path           = require('path');


 router.get("/author/hostLiveClass",isLoggedIn,function(req,res) {

 	 Notice.find({},function(err,notices){
  if(err)console.log(err);
  res.render("host_class",{user: req.user,notices: notices})
 })

 	
 })

 router.post("/author/hostLiveClass",isLoggedIn,function(req,res) {

 	console.log(req.body);
 	res.json({mes: req.body});

 	
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

