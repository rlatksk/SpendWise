const express = require("express");
const router = express.Router();
const Transaction = require('../../db-schema/Transaction')

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

router.get("/", checkAuthenticated, (req, res) => {
  res.render("index", { title: "Home" });
});

router.get('/transactions', (req, res) => {
    res.render('transactions', { title: 'Transactions' });
});


router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs", { title: "Register" });
});

module.exports = router;
