const express = require("express");
const router = express.Router();
const Transaction = require('../../db-schema/Transaction')
const User = require("../../db-schema/User");
const { insertTransaction } = require('../../functions/transactionsFunction');

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login")  ;
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

router.get("/", checkAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.session.passport.user });
    const transactions = await Transaction.find({ username: user.username });
    res.render("index", { title: "Home", user, transactions }); // Pass both user and transactions data to the view
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/transactions', checkAuthenticated, async (req, res) => {
  try {
    const user = await User.find({ id: req.session.passport.user });
    const transactions = await Transaction.find({ username: user[0].username });
    // console.log(user, transactions);
    res.render('transactions', { title: 'Transactions', transactions }); // Pass the transactions data to the view
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/api/insertTransaction', checkAuthenticated, async (req, res) => {
  // Call the insertTransaction function
  try {
    const user = await User.findOne({ id: req.session.passport.user });
    const { type, category, notes, amount } = req.body;
    console.log(user.username)
    console.log(category)
    console.log('Request body:', req.body);
    await insertTransaction(user.username, type, category, notes, amount, Date.now());
    res.status(200).json({ message: 'Transaction inserted successfully' });
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ error: 'Error inserting transaction' });
  }
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login", { title: "Login", showHeader: false });
});

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs", { title: "Register", showHeader: false});
});

router.get("/verify", (req, res) => {
  res.render("verify", { title: "Verify", showHeader: false });
});

module.exports = router;
