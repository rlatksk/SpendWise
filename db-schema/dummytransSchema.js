const mongoose = require('mongoose')

//Dummy db
const transactionSchema = new mongoose.Schema({
        income : {
            type : Number,
        },
        
        expense : {
            type : Number,
        },
        
        notes : {
            type : String,
            default : null
        },
      
})

module.exports = mongoose.model('transactions', transactionSchema);