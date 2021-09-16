var dotenv         = require('dotenv').config();
var express        = require("express");
var bodyParser     = require("body-parser");
var passport       = require("passport");
var mongoose       = require("mongoose");
var User           = require("./models/user");
var Exam           = require("./models/exam");
var Answer         = require("./models/answer");
var Notice         = require("./models/notice");
var Message        = require("./models/message");
var middlewares    = require("./middlewares/middleware");
var localStrategy  = require("passport-local");
var methodOverride = require("method-override");
var nodemailer     = require("nodemailer");
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var fileUpload     = require('express-fileupload');
var flash          = require('connect-flash');
var cron           = require("node-cron");
var socket         = require("socket.io"); 
var fs             = require('fs');
var path           = require('path'); 
var app            = express();
var port           = process.env.PORT || 3000; 
var mongoDbStr;


var sl = require("./routs/signup-login");
var ct = require("./routs/test");
var submit_test = require("./routs/submit-test");
var admin = require("./routs/admin");
var author = require("./routs/author");
var user_controler = require("./routs/user_controler");
var send_mail = require("./routs/send_mail");
var send_message = require("./routs/send_message");





// https://afternoon-citadel-20931.herokuapp.com/
// mongoose configuration
if(port === 3000){
mongoDbStr = "mongodb://localhost:27017/nghs";
console.log(mongoDbStr)
}else {
  mongoDbStr = process.env.MONGODB_CON_STR;
}

mongoose.connect(mongoDbStr,{useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useFindAndModify', false);



app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.join(__dirname,'tmp'),
})); 


  // =====================
 // passport configuration
// =====================

app.use(require('express-session')({ secret: "My name is MD Ripon Islam", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(function(req,res,next){

  res.locals.currenUser = req.user;
  res.locals.user     = req.user;
 
  res.locals.error         = req.flash("error");
  res.locals.success       = req.flash("success");
  res.locals.notification  = req.flash("notification");


 Notice.find({},function(err,notices){
    if(err)console.log(err);
res.locals.notices = notices;
next();
  });


});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// passport-google-oauth2 setup

passport.use(new GoogleStrategy({
    clientID:    process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    
      
      User.findOne({googleId: profile.id},function(err,user){
           if(user){
            done(null, user);
           }else{
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              picture: profile.picture
            });
            user.save(function(err){
              if (err){
                console.log(err)
              }else{
                done(null,user)
              };
            });;
           };
      });
  
  }
));


app.use(sl);
app.use(ct);
app.use(submit_test);
app.use(admin);
app.use(author);
app.use(user_controler);
app.use(send_mail);
app.use(send_message);

 
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });



  // =================================
 // cleaning database after restating |
//====================================


// Answer.deleteMany({}, function(){
//   console.log("done")
// });

// Exam.deleteMany({}, function(){
//   console.log("done")
// });


  // ====================
 // home rout
// ====================

app.get("/",function(req,res){
	var title = "NGHS | Home"
	res.render("index",{title: title,currenUser: req.user});
});


  // ====================
 // file upload rout
// ====================
app.get("/upload", middlewares.isLoggedIn,function(req,res){
   var Utitle = "NGHS | Upload"
   res.render("upload",{title: Utitle,currenUser: req.user});

});

app.post("/upload",middlewares.isLoggedIn,function(req, res){

    
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

var filename = req.user.name + ".png";

    targetFile.mv(path.join(__dirname, 'public/uploads/',filename), function(err){
      var title = "NGHS | Something is wrong"
        if (err){
          return res.render("404",{title: title,currenUser: req.user});
        }
        res.send('File uploaded!');
    });
});
   
 

  // =================
 // notice route 
// =================



app.get("/user/notices/all",middlewares.isLoggedIn,function(req,res){


var notices = [];
var tempUser = req.user;
Notice.find({},function(err,ns){
    if(err)console.log(err);

    if (tempUser.isAuthor) {

      ns.forEach( function(notice) {
         if( notice.notice_type === "normal"){
         notices.push(notice);
       }
      });

       res.json(notices);

    }else{

      ns.forEach( function(notice) {
         if(notice.class === tempUser.class && notice.section === tempUser.section  || notice.notice_type === "normal"){
            notices.push(notice);
         }

      });

       res.json(notices);
    
    }



});



})
 
app.get("/user/message/all",middlewares.isLoggedIn,function(req,res){


var messages = [];
var tempUser = req.user;
Message.find({},function(err,ns){
    if(err)console.log(err);



      ns.forEach( function(msg) {
         if(msg.to.user.id === tempUser._id && msg.to.user.class === tempUser.class && msg.to.user.section === tempUser.section ){
            messages.push(msg);
            
         }

      });

       res.json(messages);
    
 



});



})
 


app.listen(port,function(){
	console.log("Server started at port ..." + port);
});






