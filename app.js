if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require('express')
const expressLayout = require('express-ejs-layouts');
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const dummySchema = require('./db-schema/dummySchema.js');
// const dummyTransactionSchema = require('./db-schema/dummytransSchema.js');
const realTransactionSchema = require('./db-schema/Transaction.js');
const user = require('./db-schema/User.js');
const authRoutes = require('./server/routes/auth');

app.use('/', authRoutes);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/auth', require('./server/routes/auth'));

app.get('/favicon.ico', (req, res) => res.status(204)); //Just to prevent chart.js console error on favicon.ico

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

//CRUD FUNCTIONS for user schema (admin)
function insertUserData (usernameValue, emailValue) {
  usernameValue = usernameValue.toLowerCase();
  if(usernameValue != null && emailValue != null){
    dummySchema.insertOne(
      {
        username : usernameValue.toString(),
        email : emailValue.toString(),
      }
    )
  } else {
    console.error('Username or email address is null')
  }
}

function deleteUserData(usernameValue) {
  usernameValue = usernameValue.toLowerCase();
  if(usernameValue != null){
    dummySchema.deleteMany({ username: usernameValue })
    .then(() => console.log(`User data with username(${usernameValue.toString()}) deleted successfully`))
    .catch((err) => console.error('Error deleting data:', err));
  } else {
    console.error('Username is null')
  }
}

function updateUserEmail(usernameValue, oldEmailValue, emailValue){
  usernameValue = usernameValue.toLowerCase();
  if(usernameValue != null && oldEmailValue != null && emailValue != null){
    dummySchema.updateOne(
      { //old email verification
      username : usernameValue,
      email : oldEmailValue
      }, 
    
      {email : emailValue})
      .then(() => console.log(`Email address for username(${usernameValue}) has been updated to ${emailValue}`))
      .catch((err) => console.error('Error deleting data:', err));
  } else {
    console.error('Email change failed ! (Cannot define old email address or new email address)');
  }
}


//Display stored data in db
app.get('/db', async(req,res)=>{
  const userData = await dummySchema.find();
  res.json(userData);
})

// app.get('/db/transactions', async(req,res)=>{
//   const userData = await dummyTransactionSchema.find();
//   res.json(userData);
// })

app.get('/db/realTransactions', async(req,res)=>{
  const userData = await realTransactionSchema.find();
  res.json(userData);
})

app.get('/db/user', async(req,res)=>{
  const userData = await user.find();
  res.json(userData);
})

  