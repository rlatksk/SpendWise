const mongoose = require('mongoose');

const realTransactionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
});

module.exports = mongoose.model('RealTransactions', realTransactionSchema);
