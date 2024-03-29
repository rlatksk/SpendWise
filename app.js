if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require('express')
const expressLayout = require('express-ejs-layouts');
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const dummySchema = require('./db-schema/dummySchema.js');
const dummyTransactionSchema = require('./db-schema/dummytransSchema.js');
const authRoutes = require('./server/routes/auth');

app.use('/', authRoutes);
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
app.use('/auth', require('./server/routes/auth'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

//CRUD FUNCTIONS for user schema
function insertUserData (usernameValue, emailValue) {
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
  if(usernameValue != null){
    dummySchema.deleteMany({ username: usernameValue })
    .then(() => console.log(`User data with username(${usernameValue.toString()}) deleted successfully`))
    .catch((err) => console.error('Error deleting data:', err));
  } else {
    console.error('Username is null')
  }
}

function updateUserEmail(usernameValue, oldEmailValue, emailValue){
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

//CRUD Functions for transactions schema
function insertData (incomeValue, expenseValue, notesValue) {
  if(incomeValue != null || expenseValue != null){
    dummyTransactionSchema.insertMany(
      { 
        income : incomeValue,
        expense : expenseValue,
        notes : notesValue
      }
    )
  } else {
    console.log("Income or Expense is null")
  }
}

function deleteData(identifierNum) {
  if(identifierNum != null){
    dummyTransactionSchema.deleteOne({ _id: identifierNum })
    .then(() => console.log(`User data with username(${identifierNum.toString()}) deleted successfully`))
    .catch((err) => console.error('Error deleting data:', err));
    } else {
      console.error("Identifier number is null");
    }
  } 

  function updateExpenseData(identifierNum, newValue){
    if(identifierNum != null && newValue != null){
      dummyTransactionSchema.findOneAndUpdate({ _id : identifierNum}, {expense : newValue})
        .then(() => console.log(`Expense history for transaction id(${identifierNum}) has been updated to ${newValue}`))
        .catch((err) => console.error('Error updating data:', err));
    } else {
      console.error('Cannot find transaction');
    }
  }

  function updateIncomeData(identifierNum, newValue){
    if(identifierNum != null && newValue != null){
      dummyTransactionSchema.findOneAndUpdate({ _id : identifierNum}, {income : newValue})
        .then(() => console.log(`Income history for transaction id(${identifierNum}) has been updated to ${newValue}`))
        .catch((err) => console.error('Error updating data:', err));
    } else {
      console.error('Cannot find transaction');
    }
  }

// function test
// insertUserData("WY", "wy@gmail.com") //function test
// insertUserData("fakeuser123", "fake@email.com")
// deleteUserData("fakeuser123")
// updateUserEmail("WY", "wy@gmail.com", null)

// insertData(500000, null, null)
// deleteData('6603ff1f18088ae73833811a')
// updateExpenseData('6603fdd7b991cf8c25c16ff8', 20000)
// updateIncomeData('6603fe22a6ff5b2ffd4f8c35', 20000)


//Display stored data in db
app.get('/db', async(req,res)=>{
  const userData = await dummySchema.find();
  res.json(userData);
})

app.get('/db/transactions', async(req,res)=>{
  const userData = await dummyTransactionSchema.find();
  res.json(userData);
})

