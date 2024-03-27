const express = require('express')
const expressLayout = require('express-ejs-layouts');
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const dummySchema = require('./db-schema/dummySchema.js');

app.use(express.json())
app.use(express.static('public'));

dotenv.config()

const port = process.env.PORT;
const database = process.env.MONGO_URLdummy

mongoose.connect(database)
  .then(() => console.log(`Connected to Database ${database}`));

//Engine Templating
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

//Display stored data in db


function insertData () {
  dummySchema.insertMany([
    {
      info : {
        name : 'Justin Salim',
        email: 'salim@yahoo.com'
      }
    }
  ])
}
insertData()

app.get('/db', async(req,res)=>{
  const userData = await dummySchema.find();
  res.json(userData);
})


