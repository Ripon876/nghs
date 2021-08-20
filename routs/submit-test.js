var express        = require("express");
var app            = express();
var router         = express.Router();
var User           = require("../models/user");
var Exam           = require("../models/exam");
var Answer         = require("../models/answer");
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
		};
		
		res.render("submit_test",{user: req.user,title: title,notices: notices,test: test})

     });


		
	});

});

router.post("/test/submit-test/:id",isLoggedIn,function(req,res){
	var answer = req.body.answer;
	var testAnswer = {
	user: {
        id: req.user._id,
        username: req.user.username,
        name: req.user.name
    },
    test_id: req.params.id,
    answer: answer
	}
	Answer.create(testAnswer,function(err,answer){
		if(err)
			{
				console.log(err);
				req.flash('submissionFailed', 'Answer not submited properly');      
				res.redirect("/user/dashboard")
			}

		req.flash('submissionDone', 'Answer successfully submited');      
		res.redirect("/user/dashboard")

	});
});




module.exports = router;


function isLoggedIn(req,res,next){ // 
  if(req.isAuthenticated()){      //   this function used for preventing   
    return next();               //   a logged out user to visite   
  }else{                        //   the secreat pages 
 							   //   

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


