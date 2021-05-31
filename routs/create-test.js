var express        = require("express");
var router         = express.Router();
var User           = require("../models/user");
var Exam           = require("../models/exam");
var Notice         = require("../models/notice");
var formidable     = require('formidable');

router.get("/author/exam/new",isLoggedIn,function(req,res){

     if(req.user.isAuthor){
      Notice.find({},function(err,notices){
        if (err){
          console.log(err);
        }else{
          res.render("create_test",{user: req.user,notices: notices});
        };
      });
          
        }else{
          res.redirect("/");
        };

});

router.post("/new-test",isLoggedIn,function(req,res){
  // console.log(req.body);
  // console.log(req.files);
    // var form = new formidable.IncomingForm();

    // form.parse(req);

    // form.on('fileBegin', function (name, file){
    //     file.path = __dirname + '/uploads/' + file.name;
    // });

    // form.on('file', function (name, file){
    //     console.log('Uploaded ' + file.name);
    // });

    // res.sendFile(__dirname + '/index.html');
})

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