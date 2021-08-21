var express        = require("express");
var app            = express();
var router         = express.Router();
var fileUpload     = require('express-fileupload');
var flash          = require('connect-flash');
var fs             = require('fs');
var path           = require('path');
var middlewares    = require("../middlewares/middleware");

router.get("/sendmail",middlewares.isLoggedIn,function(req,res){
	    var Stitle = "NGHS | Send Email";
        res.render("email",{title: Stitle,currenUser: req.user});
});

router.post("/mail",middlewares.isLoggedIn,function(req,res){
  
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
    // console.log('Email sent: ' + info.response);
    res.send("email successfully sent..");
  }
});




});

module.exports = router;



