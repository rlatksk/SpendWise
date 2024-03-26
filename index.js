const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const schema = require('./db-schema/dummySchema.js')
app.use(express.json())

dotenv.config()

const port = process.env.PORT;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to Database'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

app.get('/', function(req,res){
    res.send('Test')
})

//Display stored data in db
app.get('/db', async(req,res)=>{
        const userData = await schema.find();
        res.json(userData);
})


