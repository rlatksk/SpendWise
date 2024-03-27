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
const database = process.env.MONGO_URIdummy

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
      name : 'Salim',
      email : 'justin123@gmail.com',
    }
  ])
}
insertData() //function test

function deleteData() {
  dummySchema.deleteMany({ dateCreated: null })
    .then(() => console.log('Data with null dateCreated deleted successfully'))
    .catch((err) => console.error('Error deleting data:', err));
}
deleteData() //function test

app.get('/db', async(req,res)=>{
  const userData = await dummySchema.find();
  res.json(userData);
})


