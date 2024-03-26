const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const port = process.env.PORT;

app.use(express.json())

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

app.get('/', function(req,res){
    res.send('Test')
})
