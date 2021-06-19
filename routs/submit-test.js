var express        = require("express");
var app            = express();
var router         = express.Router();
var User           = require("../models/user");
var Exam           = require("../models/exam");
var Notice         = require("../models/notice");
var fileUpload     = require('express-fileupload');
var fs             = require('fs');
var path           = require('path');


router.get("/test/submit/:testId",isLoggedIn,function(req,res) {
	var title = "NGHS | Submit Test";

	Exam.findById(req.params.testId,function(err,test){
		if (err){
			console.log(err);
			res.send("something went wrong");
		}

     Notice.find({},function(err,notices){
     			if (err){
			console.log(err);
			res.send("something went wrong");
		}
		
		res.render("submit_test",{user: req.user,title: title,notices: notices,test: test})

     })


		
	})

})

module.exports = router;


function isLoggedIn(req,res,next){ // 
  if(req.isAuthenticated()){      //   this function used for preventing   
    return next();               //   a logged out user to visite   
  }else{                        //   the secreat pages      
    res.redirect("/login");    //          
  }
}


function isLoggedOut(req,res,next){ //                       
  if(!req.isAuthenticated()){      //  this function used for preventing       
    return next();                //  a logged in user to visite       
  }else{                         //  the login and registaion page
    res.redirect("/");          //           
  }
}
