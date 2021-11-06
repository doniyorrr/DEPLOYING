const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const chalk = require("chalk");
const port = 3000;
const passport = require("passport");
// const r_Passport = require('./passport/passport');
const r_Index = require("./routers/index");
const r_Add = require("./routers/add");
const r_User = require("./routers/user");
const ExpressValidator = require("express-validator");
const session = require("express-session")
const dataBase = require("./md/db")
const app = express();


app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

//========================================================= express-VAlidator
app.use(
  ExpressValidator({
    errorFormatter: (param, msg, value) => {
      let namespace = param.split(".");
      root = namespace.shift();
      formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);


mongoose.connect(dataBase.db);

const db = mongoose.connection;
db.on("open", () => {
  console.log("MongoDB running");
});
db.on("error", (err) => {
  console.log("MongoDB ERROR running", err);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require("./passport/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());
app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use(r_Index);
app.use(r_Add);
app.use(r_User);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
