var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var mongoose = require("mongoose");
var User   = require("./models/user.js");
var localStrategy = require("passport-local");

// mongoose configuration
mongoose.connect("mongodb://localhost:27017/nghs", {useUnifiedTopology: true, useNewUrlParser: true});


var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static("public"));


// passport configuration

app.use(require('express-session')({ secret: "My name is MD Ripon Islam", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// port
// var port = process.env.PORT || 8080;

// initial routs

app.get("/",function(req,res){
	res.send("this is the home route");
});
app.get("/secret",isLoggedIn,function(req,res){
	res.send("this is the secret page....");
});

// registation route
app.get("/register",function(req,res){
	res.render("register");
})
app.post("/register",function(req,res){
	var newUser = new User({username: req.body.username});
      User.register(newUser,req.body.password,function(err,user){
      	if(err){
      		console.log(err);
      		res.render("register")
      	}else{
      		console.log(user);
      		passport.authenticate("local")(req,res,function(){

      			res.redirect("secret");
      		})
      	}
      });


})

// login rout
app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",{successRedirect: "/secret",failureRedirect: "/login"}),function(req,res){
});

// logout rout
app.get("/logout",function(req,res){

	req.logout();
	res.redirect("/");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect("/login");
	}
}

app.listen("8080",function(){
	console.log("Server started at port ...8080");
});
