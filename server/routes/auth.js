const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');

router.use(flash());
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'));
router.use(express.json())

router.use(express.urlencoded({ extended: false }));

const initializePassport = require('../../config/passport-config');

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

const users = []
initializePassport(passport, email =>
  users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } catch (err) {
      console.log(err);
      res.redirect('/register')
    }
  });

router.delete('/logout', (req, res) => {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

module.exports = router;