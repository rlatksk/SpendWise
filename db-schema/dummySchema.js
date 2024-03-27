const mongoose = require('mongoose')

//Dummy db
const userSchema = new mongoose.Schema({
    info : {
        name : String,
        email : String
    }
})

module.exports = mongoose.model('users', userSchema);