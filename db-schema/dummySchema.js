const mongoose = require('mongoose')

//Dummy db
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true
    },

    dateCreated : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('users', userSchema);