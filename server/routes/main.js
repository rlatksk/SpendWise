const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const locals = {
        title: 'Home',
        description: 'Welcome to the home page'
    };
    res.render('index', { locals });
});

router.get('/transactions', (req, res) => {
    res.render('transactions', { title: 'Transactions' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

module.exports = router;