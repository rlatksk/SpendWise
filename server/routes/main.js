const express = require('express');
const router = express.Router();
const Transaction = require('../../db-schema/Transaction')

router.get('/', (req, res) => {
    const locals = {
        title: 'Home',
        description: 'Welcome to the home page'
    };
    res.render('index', { locals });
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


router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

module.exports = router;