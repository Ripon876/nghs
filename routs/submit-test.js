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
var middlewares    = require("../middlewares/middleware");

router.get("/test/submit/:testId",middlewares.isLoggedIn,function(req,res) {
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

router.post("/test/submit-test/:id",middlewares.isLoggedIn,function(req,res){
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