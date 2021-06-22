var dotenv         = require('dotenv').config();
var express        = require("express");
var bodyParser     = require("body-parser");
var passport       = require("passport");
var mongoose       = require("mongoose");
var User           = require("./models/user");
var Exam           = require("./models/exam");
var Answer         = require("./models/answer");
var Notice         = require("./models/notice");
var localStrategy  = require("passport-local");
var methodOverride = require("method-override");
var nodemailer     = require("nodemailer");
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var fileUpload     = require('express-fileupload');
var flash          = require('connect-flash');
var fs             = require('fs');
var path           = require('path');
var app            = express();
var port           = process.env.PORT || 3000; 
// var socket = require("socket.io");

var sl = require("./routs/signup-login");
var ct = require("./routs/test");
var submit_test = require("./routs/submit-test");


// https://afternoon-citadel-20931.herokuapp.com/
// mongoose configuration
mongoose.connect("mongodb://localhost:27017/nghs", {useUnifiedTopology: true, useNewUrlParser: true});
//  mongoose.connect("mongodb+srv://ripon:Ripon876@cluster0.9uds0.mongodb.net/nghs?retryWrites=true&w=majority", {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useFindAndModify', false);



app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.join(__dirname,'tmp'),
}));

// ===================
// send massage
// ===================

app.get("/message",function(req,res){
  res.render("send_massage");
})



// =====================
// passport configuration
// =====================

app.use(require('express-session')({ secret: "My name is MD Ripon Islam", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(function(req,res,next){

  res.locals.currenUser = req.user;
  res.locals.error      = req.flash("error");
  res.locals.success      = req.flash("success");
  next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
// // passport.serializeUser(User.serializeUser());
// // passport.deserializeUser(User.deserializeUser());
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
    // console.log(profile);
      
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
 
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/');
  });





// ====================
// home rout
// ====================

app.get("/",function(req,res){
	var title = "NGHS | Home"
	res.render("index",{title: title,currenUser: req.user});
});

app.use(sl);
app.use(ct);
app.use(submit_test);
// ====================
// email rout
// ====================
app.get("/sendmail",isLoggedIn,function(req,res){
	    var Stitle = "NGHS | Send Email";
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
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD
  }
});
// mdforhadhossain297@gmail.com
var mailOptions = {
  from: process.env.GMAIL_ADDRESS,
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

// ====================
// file upload rout
// ====================
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



    targetFile.mv(path.join(__dirname, 'public/uploads/' + req.user.username, targetFile.name), function(err){
      var title = "NGHS | Something is wrong"
        if (err){
          return res.render("404",{title: title,currenUser: req.user});
        }
            
        res.send('File uploaded!');
    });
  
});
  // ====================
 // users dashboard rout
// ====================

app.get("/user/dashboard",isLoggedIn,function(req,res){
  var title = "NGHS | User Dashboard";
  var obj = {
  class: req.user.class,
  section: req.user.section
}
var usreAnswers = {
  user: {
      id: req.user._id,
      username: req.user.username
  }
}


    User.findById(req.user._id,function(err,user){
      if (err) {
        console.log(err)
      }else{

        Notice.find({},function(err,notices){
          if (err) {
            console.log(err);
          }
          else{
Exam.find(obj,function(err,tests){
  if(err){
    console.log(err);
  }

Answer.find(usreAnswers,function(err,answers){
  if(err){
    console.log(err);
  }
   res.render("user_dashborad",{answers: answers,user: user,title: title,notices: notices,tests: tests,error: req.flash("submissionFailed"),success: req.flash("submissionDone"),notification: req.flash("notification")});
})



}) 
          }
        });
      }
    });
});
app.get("/user/profile",isLoggedIn,function(req,res){
  var title = "NGHS | User Profile";
  User.findById(req.user._id,function(err,user){
    if (err) {
      console.log(err)
    }else{
        res.render("user_profile",{title: title,user: user});
    }
  });

});
app.get("/user/profile/edit",isLoggedIn,function(req,res){
  var title = "NGHS | Edit Profile";
  User.findById(req.user._id,function(err,user){
    if (err) {
      console.log(err)
    }else{
            Notice.find({},function(err,notices){
        if (err){
          console.log(err);
        }else{
         res.render("edit_profile",{title: title,user: user,notices: notices});          
        };
      });

    }
  });

});
app.put("/user/profile",isLoggedIn,function(req,res){

   var user = req.body.user;
   User.findByIdAndUpdate(req.user._id,user,{new: true},function(err,user){
     if (err) {
      console.log(err)
     }else{
        console.log(user);
        if (req.user.isAdmin) {
           res.redirect("/admin");
        }else{
          res.redirect("/user/dashboard");
        };
       
     };
   });

});

// ====================
// author rout
// ====================

app.get("/author/dashboard",isLoggedIn,function(req,res){
      
var obj = {
  author: {
    id: req.user._id,
    username: req.user.username
  }
}

      if(req.user.isAuthor){
              Notice.find({},function(err,notices){
        if (err){
          console.log(err);
        }else{

Exam.find(obj,function(err,tests){
  if(err){
    console.log(err)
  }

  res.render("author_dashboard",{user: req.user,notices: notices,tests: tests,success: req.flash('info'),error: req.flash('wrong'),notification: req.flash("notification")});
})

        };
      });
          
        }else{
          res.redirect("/");
        };


});

// ====================
// admin rout
// ====================
app.get("/admin",isLoggedIn,function(req,res){
	if (req.user.isAdmin){

  User.find({},function(err,users){
    if (err) {
      console.log(err)
    }else{
      res.render("admin",{title: "NGHS | Admin",currenUser: req.user,users: users});
    }
  });	
	}else{
		res.redirect("/");
	};
});
app.get("/admin/create_author",isLoggedIn,function(req,res){
  res.render("create_author");
})
app.post("/admin",isLoggedIn,function(req,res){
  var id = req.body.id;

User.findById(id,function(err,user){
  if (user.isAuthor) {
  var doAuthor = {isAuthor: false};

   User.findByIdAndUpdate(id,doAuthor,{new: true},function(err,user){
        if (err) {
         console.log(err)
        }else{
           console.log(user);
              res.redirect("/admin");
        };
      });

  }else{
    
      var doAuthor = {isAuthor: true};
User.findByIdAndUpdate(id,doAuthor,{new: true},function(err,user){
     if (err) {
      console.log(err)
     }else{
        console.log(user);
        res.redirect("/admin");
     };
   });


  }
})

});

app.get("/user/edit/:id",isLoggedIn,function(req,res){
   User.findById(req.params.id,function(err,user){
    if (err) {
      console.log(err)
    }else{
      res.render("edit",{user: user});
    };
   })
});
app.put("/admin/user/edit",isLoggedIn,function(req,res){
   var user = req.body.user;
   var id = req.body.id
   User.findByIdAndUpdate(id,user,{new: true},function(err,user){
     if (err) {
      console.log(err)
     }else{
        console.log(user);
        if (req.user.isAdmin) {
           res.redirect("/admin");
        }else{
          res.redirect("/user/dashboard");
        };
       
     };
   });
});

app.get("/delete_user/:id",isLoggedIn,function(req,res){
     
     if (req.user.isAdmin === true) {



    User.findById(req.params.id,function(err,user){
    if (err) {
      console.log(err)
      res.redirect("/admin")
    }else{
      res.render("delete_user",{user: user});
    };
  }); 

  }
else if (req.user.isAuthor == true) {
  req.flash('notification', 'You Do Not Have The Permission To Do That');  
  res.redirect("/author/dashboard");             
}
else if(req.user.isUser == true){
  req.flash('notification', 'You Do Not Have The Permission To Do That');  
  res.redirect("/user/dashboard");             
}


});

app.delete("/admin/delete_user/:id",isLoggedIn,function(req,res){
  User.findById(req.params.id,function(err,user){
    if(err){
      console.log(err);
    }else{

         fs.rmdir('public/uploads/' + user.username,function(){
             console.log("Directory Deleted");
         });
      
         };

           User.findByIdAndRemove(user._id,function(err,user){
              if (err) {
                    console.log(err);
              }else{
                  console.log("successfully Deleted");
                  res.redirect("/admin");
              };
            });
  });

});



// =================
// notice route 
// =================


app.get("/admin/notice",isLoggedIn,function(req,res){
      
      Notice.find({},function(err,notices){
        if (err){
          console.log(err);
        }else{
           res.render("notice",{notices: notices});
        };
      });
});

app.get("/admin/notice/new",function(req,res){
  res.render("new_notice");
});

app.post("/admin/notice",function(req,res){
  var notice = {
    notice: req.body.notice,
    user: {
      name: req.user.name
    }
  }
  Notice.create(notice,function(err,notice){
    if (err) {
      console.log(err);
    }else{
    console.log(notice);
    res.redirect("/admin/notice");
    };
  });
});;


app.get("/admin/notice/delete/:id",function(req,res){
  var id = req.params.id;
  Notice.findByIdAndRemove(id,function(err,notice){
    if (err) {
      console.log(err);
    }else {
      res.redirect("/admin/notice");
    }
  })
})


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

app.listen(port,function(){
	console.log("Server started at port ..." + port);
});





