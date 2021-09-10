var express        = require("express");
var router         = express.Router();
var passport       = require("passport");
var mongoose       = require("mongoose");
var User           = require("../models/user");
var localStrategy  = require("passport-local");
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var fs             = require('fs');
var path           = require('path');
var middlewares    = require("../middlewares/middleware");


  // ====================
 // registration rout
// ====================

router.get("/register",middlewares.isLoggedOut,function(req,res){
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
     


           if (req.body.username === process.env.ADMIN_USER_NAME) {

              var doAuthor = {isAdmin: true};
            User.findByIdAndUpdate(user._id,doAuthor,{new: true},function(err,user){
                   if (err) {
                    console.log(err);
                   }else{
                      // console.log(user);


          passport.authenticate("local")(req,res,function(){
             res.redirect("/admin");
          });


                     
                   };
                 });
             }else{
          passport.authenticate("local")(req,res,function(){
              res.redirect("/");
          });
             
             };

      	};
      });

})
 
  // ====================
 // login rout
// ====================

router.get("/login",middlewares.isLoggedOut,function(req,res){
  var Ltitle = "NGHS | Login"
	res.render("login",{title: Ltitle,currenUser: req.user,error: req.flash('loginFirst')});
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




module.exports = router;