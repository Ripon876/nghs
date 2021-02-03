var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var mongoose = require("mongoose");
var User   = require("./models/user.js");
var localStrategy = require("passport-local");
var nodemailer = require("nodemailer");

// file-upload 
var fileUpload = require('express-fileupload');
var fs = require('fs');
var path = require('path');


// mongoose configuration
mongoose.connect("mongodb://localhost:27017/nghs", {useUnifiedTopology: true, useNewUrlParser: true});


var app = express();
// var routes = require('./routes');
app.set("view engine","ejs");
// app.use('./routes', routes)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// file upload
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.join(__dirname,'tmp'),
}));

// passport configuration

app.use(require('express-session')({ secret: "My name is MD Ripon Islam", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// port
 var port = process.env.PORT || 8080;



// initial routs

app.get("/",function(req,res){
	var title = "NGHS | Home"
	res.render("index",{title: title,currenUser: req.user});
});
app.get("/secret",isLoggedIn,function(req,res){
	res.send("this is the secret page....");
});

// registation route
app.get("/register",isLoggedOut,function(req,res){
	var Rtitle = "NGHS | Register"
	res.render("register",{title: Rtitle,currenUser: req.user});
})
app.post("/register",function(req,res){
	var newUser = new User({username: req.body.username});
      User.register(newUser,req.body.password,function(err,user){
      	if(err){
      		console.log(err);
      		res.render("register",{currenUser: req.user})
      	}else{
      		console.log(user);
      		passport.authenticate("local")(req,res,function(){
            
            	fs.mkdir('public/uploads/' + req.user.username, (err) => {
              if (err) {
                  throw err;
                }
                console.log("Directory is created.");
                     });
      			res.redirect("/");
      		})
      	}
      });


})

// login rout
app.get("/login",isLoggedOut,function(req,res){


    var Ltitle = "NGHS | Login"
	res.render("login",{title: Ltitle,currenUser: req.user});
});
  // var url_parts =req.url;
  //  console.log(url_parts);
app.post("/login",passport.authenticate("local",{successRedirect: "/",failureRedirect: "/login"}),function(req,res){
});

// logout rout
app.get("/logout",function(req,res){

	req.logout();
	res.redirect("/");
});

// email route
app.get("/sendmail",isLoggedIn,function(req,res){
	    var Stitle = "NGHS | Send Email"
        res.render("email",{title: Stitle,currenUser: req.user});
});






app.post("/mail",isLoggedIn,function(req,res){
  
var email = req.body.email;
var sub = req.body.sub;
var mes = req.body.mes;


// node mailer

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'islam876ripon@gmail.com',
    pass: 'Ripon01765233876'
  }
});
// mdforhadhossain297@gmail.com
var mailOptions = {
  from: 'islam876ripon@gmail.com',
  to: email,
  subject: sub,
  text: mes
};

transporter.sendMail(mailOptions, function(error, info){
	var title = "NGHS | Something is wrong"
  if (error) {
    console.log(error);
    res.render("404",{title: title,currenUser: req.user});
  } else {
    console.log('Email sent: ' + info.response);
    res.send("email successfully sent..");
  }
});




});

app.get("/upload",isLoggedIn,function(req,res){
   var Utitle = "NGHS | Upload"
   res.render("upload",{title: Utitle,currenUser: req.user});

});

app.post("/upload", function(req, res){

    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let targetFile = req.files.target_file;

    // Checking File Size (Max Size - 1MB)
    if(targetFile.size > 1048576){

        // Deleting Temporary File
        fs.unlinkSync(targetFile.tempFilePath);
        return res.status(413).send("File is too Large");
    }



    targetFile.mv(path.join(__dirname, 'public/uploads/' + req.user.username, targetFile.name), (err) => {
        if (err)
            return res.status(500).send(err);
        res.send('File uploaded!');
    });
  
});

function isLoggedIn(req,res,next){ // 
	if(req.isAuthenticated()){     //   this function used for preventing   
		return next();             //   a logged out user to visite   
	}else{                         //   the secreat pages      
		res.redirect("/login");    //          
	}
}


function isLoggedOut(req,res,next){ //                       
	if(!req.isAuthenticated()){     //  this function used for preventing       
		return next();              //  a logged in user to visite       
	}else{                          //  the login and registaion page
		res.redirect("/");          //           
	}
}

app.listen(port,function(){
	console.log("Server started at port ..." + port);
});
