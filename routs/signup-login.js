var express        = require("express");
var router         = express.Router();
var passport       = require("passport");
var mongoose       = require("mongoose");
var User           = require("../models/user");
var localStrategy  = require("passport-local");
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var fs             = require('fs');
var path           = require('path');






router.get("/n",function(req,res){
	res.send("this the separated route file");
});
// ====================
// registration rout
// ====================

router.get("/register",isLoggedOut,function(req,res){
	var Rtitle = "NGHS | Register"
	res.render("register",{title: Rtitle});
})

router.post("/register",function(req,res){
  var Rtitle = "NGHS | Register"
	var newUser = new User({username: req.body.username,name: req.body.name});
      User.register(newUser,req.body.password,function(err,user){
      	if(err){
      		console.log(err);
      		res.render("index",{title: Rtitle})
      	}else{
      		console.log(user);
      		passport.authenticate("local")(req,res,function(){
            
            	fs.mkdir('public/uploads/' + req.user.username, function(err){
              if (err) {
                  console.log(err);
                };
                console.log("Directory is created.");
              
                     });
             if (req.body.username == "ripon") {

              var doAuthor = {isAdmin: true};
            User.findByIdAndUpdate(req.user._id,doAuthor,{new: true},function(err,user){
                   if (err) {
                    console.log(err);
                   }else{
                      console.log(user);
                      res.redirect("/admin");
                   };
                 });
             }else{
              res.redirect("/");
             };
             
      		});
      	};
      });


})

// ====================
// login rout
// ====================

router.get("/login",isLoggedOut,function(req,res){
  var Ltitle = "NGHS | Login"
	res.render("login",{title: Ltitle,currenUser: req.user});
});


router.post("/login",passport.authenticate("local",{successRedirect: "/",failureRedirect: "/login"}),function(req,res){
});

// ====================
// logout rout
// ====================
router.get("/logout",function(req,res){

	req.logout();
	res.redirect("/");
});




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

module.exports = router;