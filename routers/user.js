const { Router } = require("express");
const dbUser = require("../model/user");
const bcryptjs = require('bcryptjs');
const passport = require("passport");
const multer = require("../midleware/multer").single("photos"); 
const router = Router();

router.get("/account/acc", (req, res) => {
  res.render("reg", {
    title: "Royhatdan otish",
  });
});


router.post("/account/acc", multer, (req, res) => {
  req.checkBody("name", "Ismingiz bosh qolishi mumkin emas").notEmpty();
  req.checkBody("username", "loginingizni bosh qolishi mumkin emas").notEmpty();
  req.checkBody("password", "password bosh qolishi mumkin emas").notEmpty();
  req
    .checkBody("password2", "passwordni qaytakiritish bosh qolishi mumkin emas")
    .notEmpty()
    .equals(req.body.password);
  req
    .checkBody("phone", "telefon raqamingizni bosh qolishi mumkin emas")
    .notEmpty();
  req
    .checkBody("email", "emailingizni kiriting bosh qolishi mumkin emas")
    .notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    res.render("reg", {
      title: "Error",
      errors: errors,
    });
  } else {
    const db = new dbUser({
      name: req.body.name.toLowerCase(),
      username: req.body.username,
      password: req.body.password,
      phone: req.body.phone,
      email: req.body.email,
      photo: req.file.path,
    });
    bcryptjs.genSalt(10, (err, pass) => {
      bcryptjs.hash(db.password, pass, (err, hash) => {
        if (err) console.log(err);
        else {
          db.password = hash
          db.save((err) => {
            if (err) 
              throw err;
            else {
              req.flash("success", "Muvaffaqiyatli royhatdan otildi");
              res.redirect("/");
            }
          });
        }
      });
    });
  }
});

router.get("/login/log", (req, res) => {
  res.render("login", {
    title: "login",
  });
});


router.post("/login/log", (req, res , next) => {
  // console.log(req.body); 
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login/log",
      failureFlash: true ,
      successFlash: "xush kelibsiz ! tizimga kirdingiz",
    })(req, res, next);
});

router.get("/account/logout", (req, res) => {
  req.logout()
  req.flash("success" , "Tizimdan chiqdingiz")
  res.redirect("/")
});

module.exports = router;
