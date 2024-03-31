const express = require("express");
const router = express.Router();
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");

const User = require("../../db-schema/User.js");

router.use(flash());
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride("_method"));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const initializePassport = require("../../config/passport-config");

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

initializePassport(
  passport,
  (username) => User.findOne({ username: username }),
  (id) => User.findOne({ id: id })
);

router.post('/login', function(req, res, next) {
  req.body.username = req.body.username.toLowerCase();
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      req.flash('error', info.message);
      return res.redirect('/login'); 
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    req.body.username = req.body.username.toLowerCase();
    const existingUserEmail = await User.findOne({ email: req.body.email });
    if(existingUserEmail){
      req.flash("error", "Email already been used!");
      return res.redirect("/register");
    }
    const existingUsername = await User.findOne({ username: req.body.username });
    if(existingUsername){
      req.flash("error", "Username already been used!");
      return res.redirect("/register");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      id: Date.now().toString(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
});

router.delete("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

module.exports = router;
