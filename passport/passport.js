const LocalStrategy = require('passport-local');
const bcryptjs = require("bcryptjs");
const dbUser = require("../model/user");
// const { use } = require('passport');
// const passport = require('passport');


module.exports = (passport) => {
  passport.use(
    new LocalStrategy(function (username, password, done) {
      dbUser.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        bcryptjs.compare(password, user.password, (err, match) => {
          if (err) console.log(err);
          if (match) done(null, user);
          else {
            done(null, false, { message: "Tizimga kirishda hatolik bor" });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    dbUser.findById(id, function (err, user) {
      done(err, user);
    });
  });
};


