var express = require("express");
var app = express();
var router = express.Router();
var User = require("../models/user");
var Exam = require("../models/exam");
var Answer = require("../models/answer");
var Notice = require("../models/notice");
var Live_Class = require("../models/live_class_schedule");
var fileUpload = require('express-fileupload');
var flash = require('connect-flash');
var fs = require('fs');
var path = require('path');
var middlewares = require("../middlewares/middleware");


router.get("/admin", middlewares.isLoggedInAndAdmin, function(req, res) {

  if (req.user.isAdmin) {

    User.find({}, function(err, users) {
      if (err) {
        console.log(err)
      } else {
        res.render("admin", {
          title: "NGHS | Admin",
          currenUser: req.user,
          users: users,
          notification: req.flash("notification")
        });
      }
    });
  } else {
    res.redirect("/");
  };
});

router.get("/admin/create_author", middlewares.isLoggedInAndAdmin, function(req, res) {
  res.render("create_author");
});



router.post("/admin", middlewares.isLoggedInAndAdmin, function(req, res) {
  var id = req.body.id;

  User.findById(id, function(err, user) {
    if (user.isAuthor) {
      var doAuthor = {
        isAuthor: false
      };

      User.findByIdAndUpdate(id, doAuthor, {
        new: true
      }, function(err, user) {
        if (err) {
          console.log(err)
        } else {
          // console.log(user);
          res.redirect("/admin");
        };
      });

    } else {

      var doAuthor = {
        isAuthor: true
      };
      User.findByIdAndUpdate(id, doAuthor, {
        new: true
      }, function(err, user) {
        if (err) {
          console.log(err)
        } else {
          // console.log(user);
          res.redirect("/admin");
        };
      });


    }
  })

});



router.get("/user/edit/:id", middlewares.isLoggedInAndAdmin, function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      console.log(err)
    } else {
      res.render("edit", {
        user: user
      });
    };
  })
});


router.put("/admin/user/edit", middlewares.isLoggedInAndAdmin, function(req, res) {
  var user = req.body.user;
  var id = req.body.id
  User.findByIdAndUpdate(id, user, {
    new: true
  }, function(err, user) {
    if (err) {
      console.log(err)
    } else {
      // console.log(user);
      if (req.user.isAdmin) {
        res.redirect("/admin");
      } else {
        res.redirect("/user/dashboard");
      };

    };
  });
});



router.get("/delete_user/:id", middlewares.isLoggedInAndAdmin, function(req, res) {

  User.findById(req.params.id, function(err, user) {
    if (err) {
      console.log(err)
      res.redirect("/admin")
    } else {
      res.render("delete_user", {
        user: user
      });
    };
  });


});



router.delete("/admin/delete_user/:id", middlewares.isLoggedInAndAdmin, function(req, res) {

  User.findById(req.params.id, function(err, user) {
    if (err) {
      console.log(err);
    }

    if (!user.isAdmin) {

      if (!user.isAuthor) {


        var ans = {
          user: {
            id: String(user._id),
            username: String(user.username),
            name: String(user.name)
          }
        }

        Answer.deleteMany(ans, function(err, done) {
          if (err) console.log(err);
          // console.log(done)

        })

      }

      User.findByIdAndRemove(user._id, function(err, user) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully Deleted");
          req.flash('notification', 'User Deleted Successfully');
          res.redirect("/admin");
        };
      });

    } else {
      req.flash('notification', 'Admin Cannot be deleted');
      res.redirect("/admin");
    }

  });

});


router.get("/admin/searchuser/:name", middlewares.isLoggedInAndAdmin, function(req, res) {
  var name = req.params.name;
  var userDatas = [];
  // console.log(name)


  User.find({}, function(err, users) {
    if (err) {
      console.log(err)
    }

    users.forEach(function(user) {

      if (user.name.includes(name) || user.username.includes(name)) {
        userDatas.push(user)
      } else {
        // console.log("not found")
      }

    });


    function r() {
      res.json(userDatas)
    }
    r();

  })
})


router.get("/admin/notice", middlewares.isLoggedInAndAdmin, function(req, res) {

  Notice.find({}, function(err, notices) {
    if (err) {
      console.log(err);
    } else {
      res.render("notice");
    };
  });
});

router.get("/admin/notice/new", middlewares.isLoggedInAndAdmin, function(req, res) {
  res.render("new_notice");
});

router.post("/admin/notice", middlewares.isLoggedInAndAdmin, function(req, res) {
  var notice = {
    notice: req.body.notice,
    user: {
      id: req.user._id,
      name: req.user.name
    },
    notice_type: "normal"
  }
  Notice.create(notice, function(err, notice) {
    if (err) {
      console.log(err);
    } else {
      // console.log(notice);
      res.redirect("/admin/notice");
    };
  });
});;


router.get("/admin/notice/delete/:id", middlewares.isLoggedInAndAdmin, function(req, res) {
  var id = req.params.id;
  Notice.findByIdAndRemove(id, function(err, notice) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/admin/notice");
    }
  })
})



module.exports = router;