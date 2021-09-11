var express = require("express");
var app = express();
var router = express.Router();
var User = require("../models/user");
var Exam = require("../models/exam");
var Answer = require("../models/answer");
var Notice = require("../models/notice");
var Live_Class = require("../models/live_class_schedule");
var Message = require("../models/Message");
var fileUpload = require('express-fileupload');
var flash = require('connect-flash');
var fs = require('fs');
var path = require('path');
var middlewares = require("../middlewares/middleware");

router.use(function(req, res, next) {

  res.locals.currenUser = req.user;
  res.locals.user = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.notification = req.flash("notification");



  Notice.find({}, function(err, ns) {
    if (err) console.log(err);

    if (req.user) {
      var notices = [];
      ns.forEach(function(notice) {
        if (notice.notice_type === "normal") {
          notices.push(notice);
        }
      });
      res.locals.notices = notices;
      next();
    } else {
      res.locals.notices = [];
      next();
    }


  });



});



router.get("/author/dashboard", middlewares.isLoggedInAndAuthor, function(req, res) {

  var obj = {
    author: {
      id: req.user._id,
      username: req.user.username
    }
  }

  if (req.user.isAuthor) {
    Notice.find({}, function(err, notices) {
      if (err) {
        console.log(err);
      } else {

        Exam.find(obj, function(err, tests) {
          if (err) {
            console.log(err)
          }

          res.render("author_dashboard", {
            user: req.user,
            tests: tests,
            success: req.flash('info'),
            error: req.flash('wrong'),
            notification: req.flash("notification")
          });
        })

      };
    });

  } else {
    res.redirect("/");
  };


});


router.get("/author/hostLiveClass", middlewares.isLoggedInAndAuthor, function(req, res) {

  var sss = {
    id: req.user._id,
    name: req.user.name
  }

  Live_Class.find({
    author: sss
  }, function(err, clas) {
    if (err) console.log(err);


    Notice.find({}, function(err, notices) {
      if (err) console.log(err);
      res.render("host_class", {
        user: req.user,
        notices: notices,
        classes: clas,
        success: req.flash("successfully_schedule_deleted"),
        error: req.flash("successfully_schedule_not_deleted")
      });
    });


  });



})

router.post("/author/hostLiveClass", middlewares.isLoggedInAndAuthor, function(req, res) {
  var live_class = {
    class_date: req.body.class_date,
    class_time: req.body.class_time,
    class: req.body.class,
    section: req.body.section,
    subject: req.body.subject,
    meeting_link: req.body.meeting_link,
    author: {
      id: req.user._id,
      name: req.user.name
    }
  }

  Live_Class.create(live_class, function(err, clas) {
    if (err) console.log(err);


    var notice = {
      notice: `${req.body.subject} - Live class - Class ${req.body.class} - Section ${req.body.section} - ID: ${clas._id}`,
      user: {
        id: req.user._id,
        name: req.user.name
      },
      notice_type: "class",
      class: req.body.class,
      section: req.body.section
    }
    Notice.create(notice, function(err, notice) {
      if (err) {
        console.log(err);
      } else {
        // console.log(notice);
        // res.redirect("/admin/notice");
        res.json({
          mes: clas
        })
      };
    });



  });

});


router.get("/author/hostLiveClass/remove/:id", middlewares.isLoggedInAndAuthor, function(req, res) {
  var id = req.params.id;
  Live_Class.findByIdAndRemove(id, function(err, cls) {
    if (err) {
      console.log(err);
      req.flash("successfully_schedule_not_deleted", "Schedule not deleted successfully");
      res.redirect("/author/hostLiveClass");
    }



    req.flash("successfully_schedule_deleted", "Schedule deleted successfully");
    res.redirect("/author/hostLiveClass");
  })
})



router.get("/author/searchuser/:clas/:section/:roll", middlewares.isLoggedInAndAuthor, function(req, res) {
  // var name = req.params.name;
  var userDatas = [];
  // console.log(name)

  var tempUser = {
    class: req.params.clas,
    section: req.params.section,
    roll: req.params.roll
  }

  User.find(tempUser, function(err, user) {
    if (err) {
      res.json([])
    } else {
      res.json(user)
    }



  })


});


router.post("/author/message", middlewares.isLoggedInAndAuthor, function(req, res) {

  var tempMsg = {
    from: {
      author: {
        name: req.user.name,
        id: req.user._id
      }
    },
    to: {
      user: {
        name: req.body.name,
        id: req.body.id,
        class: req.body.class,
        section: req.body.section,
        roll: req.body.roll
      }
    },
    message: req.body.message
  }

  Message.create(tempMsg, function(err, msg) {
    if (err) {

        res.json({
         error: "message not send"
      });

    } else {

    res.json({
      success: "message send successfully"
      });
     
      
   

    }
  })

})



module.exports = router;