const express = require("express");
const router = express.Router();
const flash = require("express-flash");
const session = require("express-session");
const crypto = require("crypto");
const passport = require("passport");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

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

// Middleware to redirect authenticated users to home
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

// Passport strategy
initializePassport(
  passport,
  (username) => User.findOne({ username: username }),
  (id) => User.findOne({ id: id })
);

// Nodemailer transporter for Gmail
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send a verification email to a user
async function sendVerificationEmail(email, username, verificationCode) {
  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Email Verification Code",
    text: `Hello ${username}, your email verification code is ${verificationCode}.`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }

  return verificationCode;
}

// Login route: Authenticates the user and redirects based on verification status
router.post("/login", function (req, res, next) {
  req.body.username = req.body.username.toLowerCase();
  passport.authenticate("local", async function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/login");
    }
    if (!user.verified) {
      try {
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        user = await User.findById(user._id);
        await User.updateOne(
          { _id: user._id },
          { verificationCode: verificationCode }
        );

        sendVerificationEmail(user.email, user.username, verificationCode);
        req.flash(
          "error",
          "Your account is not verified. We have sent you a new verification code."
        );
        req.session.email = user.email;
        return res.redirect("/verify");
      } catch (err) {
        return next(err);
      }
    } else {
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/");
      });
    }
  })(req, res, next);
});

// Register route: Registers a new user and sends a verification email
router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    req.flash("form", req.body);
    req.body.username = req.body.username.toLowerCase();
    const existingUserEmail = await User.findOne({ email: req.body.email });
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (existingUserEmail) {
      req.flash("error", "Email already been used!");
      return res.redirect("/register");
    }
    const existingUsername = await User.findOne({
      username: req.body.username,
    });
    if (existingUsername) {
      req.flash("error", "Username already been used!");
      return res.redirect("/register");
    }
    if (req.body.password !== req.body.confirmPassword) {
      req.flash("error", "Passwords do not match!");
      return res.redirect("/register");
    }
    if (!passwordRegex.test(req.body.password)) {
      req.flash(
        "error",
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return res.redirect("/register");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const user = new User({
      id: Date.now().toString(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      verificationCode: await sendVerificationEmail(
        req.body.email,
        req.body.username,
        verificationCode
      ),
    });
    await user.save();

    req.session.email = req.body.email;
    req.flash("success", "Verification code sent to your email.")
    res.redirect("/verify");
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
});

// Forgot Password route: Sends an email to the user with a password reset token
router.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    req.flash("error", "Password reset token is invalid or has expired.");
    return res.redirect("/forgotPassword");
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  await user.save();

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject: "Password Reset",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\http://${req.headers.host}/resetPassword?token=${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent.");
    req.flash(
      "info",
      "An e-mail has been sent to " + email + " with further instructions."
    );
    res.redirect("/forgotPassword");
  } catch (error) {
    console.error("Error sending email:", error);
    res.redirect("/forgotPassword");
  }
});

// Reset Password route: Resets the user's password if the provided token is valid
router.post("/resetPassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match.");
    return res.redirect(`/resetPassword?token=${token}`);
  }

  if (!user) {
    req.flash("error", "Password reset token is invalid or has expired.");
    return res.redirect("/forgotPassword");
  }

  if (!passwordRegex.test(req.body.password)) {
    req.flash(
      "error",
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
    return res.redirect(`/resetPassword?token=${token}`);
  }

  try {
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.flash("info", "Password has been reset!");
    req.session.save((err) => {
      if (err) {
        req.flash("error", "An error occurred while resetting the password.");
        return res.redirect(`/resetPassword?token=${token}`);
      }
      res.redirect("/login");
    });
  } catch (error) {
    req.flash("error", "An error occurred while resetting the password.");
    res.redirect(`/resetPassword?token=${token}`);
  }
});

// Verify route: Verifies the user's email using a verification code
router.post("/verify", async (req, res) => {
  const { code } = req.body;

  const email = req.session.email;

  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "User not found!");
    return res.redirect("/verify");
  }

  if (code !== user.verificationCode) {
    req.flash("error", "Invalid verification code!");
    return res.redirect("/verify");
  }

  if (code === user.verificationCode) {
    user.verified = true;
    await user.save();
    delete req.session.email;
    req.flash( "success", "Email verified!" );
    res.redirect("/login");
  }
});

// Logout route: Logs out the user and destroys the session
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
