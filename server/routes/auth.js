const express = require("express");
const router = express.Router();
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

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

async function sendVerificationEmail(email, username, verificationCode) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Email Verification Code',
    text: `Hello ${username}, your email verification code is ${verificationCode}.`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }

  return verificationCode;
}

router.post('/login', function(req, res, next) {
  req.body.username = req.body.username.toLowerCase();
  passport.authenticate('local', async function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      req.flash('error', info.message);
      return res.redirect('/login'); 
    }
    if(!user.verified){
      try {
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        user = await User.findById(user._id);
        await User.updateOne({ _id: user._id }, { verificationCode: verificationCode });

        sendVerificationEmail(user.email, user.username, verificationCode);
        req.flash('error', 'Your account is not verified. We have sent you a new verification code.');
        req.session.email = user.email;
        return res.redirect('/verify');
      } catch (err) {
        return next(err);
      }
    } else {
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/');
      });
    }
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
    if(req.body.password !== req.body.confirmPassword){
      req.flash("error", "Passwords do not match!");
      return res.redirect("/register");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const user = new User({
      id: Date.now().toString(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      verificationCode: await sendVerificationEmail(req.body.email, req.body.username, verificationCode),
    });
    await user.save();

    req.session.email = req.body.email;

    res.redirect("/verify");
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
});

router.post("/verify", async (req, res) => {
  const { code } = req.body;

  const email = req.session.email;

  const user = await User.findOne({ email });

  if(!user){
    req.flash("error", "User not found!");
    return res.redirect("/verify");
  }

  if(code !== user.verificationCode){
    req.flash("error", "Invalid verification code!");
    return res.redirect("/verify");
  }

  if(code === user.verificationCode) {
    user.verified = true;
    await user.save();
    delete req.session.email;
    req.flash({'success': 'Email verified!'});
    res.redirect("/login");
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
