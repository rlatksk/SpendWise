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

router.get('/transactions', async (req, res) => {
  try {
      const transactions = await Transaction.find();
      res.render('transactions', { title: 'Transactions', transactions }); // Pass the transactions data to the view
  } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).send('Internal Server Error');
  }
});


router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs", { title: "Register" });
});

module.exports = router;
