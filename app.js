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

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

//CRUD FUNCTIONS for user schema
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

// //CRUD Functions for transactions schema
// function insertData (incomeValue, expenseValue, notesValue) {
//   if(incomeValue != null || expenseValue != null){
//     dummyTransactionSchema.insertMany(
//       { 
//         income : incomeValue,
//         expense : expenseValue,
//         notes : notesValue
//       }
//     )
//   } else {
//     console.log("Income or Expense is null")
//   }
// }

// function deleteData(identifierNum) {
//   if(identifierNum != null){
//     dummyTransactionSchema.deleteOne({ _id: identifierNum })
//     .then(() => console.log(`User data with username(${identifierNum.toString()}) deleted successfully`))
//     .catch((err) => console.error('Error deleting data:', err));
//     } else {
//       console.error("Identifier number is null");
//     }
//   } 

//   function updateExpenseData(identifierNum, newValue){
//     if(identifierNum != null && newValue != null){
//       dummyTransactionSchema.findOneAndUpdate({ _id : identifierNum}, {expense : newValue})
//         .then(() => console.log(`Expense history for transaction id(${identifierNum}) has been updated to ${newValue}`))
//         .catch((err) => console.error('Error updating data:', err));
//     } else {
//       console.error('Cannot find transaction');
//     }
//   }

//   function updateIncomeData(identifierNum, newValue){
//     if(identifierNum != null && newValue != null){
//       dummyTransactionSchema.findOneAndUpdate({ _id : identifierNum}, {income : newValue})
//         .then(() => console.log(`Income history for transaction id(${identifierNum}) has been updated to ${newValue}`))
//         .catch((err) => console.error('Error updating data:', err));
//     } else {
//       console.error('Cannot find transaction');
//     }
//   }

// function test
// insertUserData("WY", "wy@gmail.com") //function test
// insertUserData("fakeuser123", "fake@email.com")
// deleteUserData("fakeuser123")
// updateUserEmail("WY", "wy@gmail.com", null)

// insertData(500000, null, null)
// deleteData('6603ff1f18088ae73833811a')
// updateExpenseData('6603fdd7b991cf8c25c16ff8', 20000)
// updateIncomeData('6603fe22a6ff5b2ffd4f8c35', 20000)


// CRUD FUNCTIONS TO BE USED FOR REAL TRANSACTIONS
// Function to insert a transaction
async function insertTransaction(username, type, category, notes, amount, date) {
    try {
        const transaction = new realTransactionSchema({
            username: username.toLowerCase(),
            type,
            category,
            notes,
            amount,
            date
        });
        await transaction.save();
        console.log("Transaction inserted successfully.");
    } catch (error) {
        console.error("Error inserting transaction:", error);
    }
}

// Function to get a transaction based on its id
async function getTransactionById(transactionId) {
    try {
        const transaction = await realTransactionSchema.findById(transactionId);
        return transaction;
    } catch (error) {
        console.error("Error getting transaction:", error);
        return null;
    }
}

// Function to get all transactions
async function getAllTransactions() {
    try {
        const transactions = await realTransactionSchema.find();
        return transactions;
    } catch (error) {
        console.error("Error getting all transactions:", error);
        return [];
    }
}

// Function to update a transaction amount based on the transaction id
async function updateTransactionAmount(transactionId, newAmount) {
    try {
        await realTransactionSchema.findByIdAndUpdate(transactionId, { amount: newAmount });
        console.log("Transaction amount updated successfully.");
    } catch (error) {
        console.error("Error updating transaction amount:", error);
    }
}

// Function to update a transaction category based on the transaction id
async function updateTransactionCategory(transactionId, newCategory) {
    try {
        await realTransactionSchema.findByIdAndUpdate(transactionId, { category: newCategory });
        console.log("Transaction category updated successfully.");
    } catch (error) {
        console.error("Error updating transaction category:", error);
    }
}

// Function to update a transaction type based on the transaction id
async function updateTransactionType(transactionId, newType) {
    try {
        await realTransactionSchema.findByIdAndUpdate(transactionId, { type: newType });
        console.log("Transaction type updated successfully.");
    } catch (error) {
        console.error("Error updating transaction type:", error);
    }
}

// Function to update a transaction date based on the transaction id
async function updateTransactionDate(transactionId, newDate) {
    try {
        await realTransactionSchema.findByIdAndUpdate(transactionId, { date: newDate });
        console.log("Transaction date updated successfully.");
    } catch (error) {
        console.error("Error updating transaction date:", error);
    }
}

// Function to update a transaction note based on the transaction id
async function updateTransactionNote(transactionId, newNote) {
  try {
      await realTransactionSchema.findByIdAndUpdate(transactionId, { notes: newNote });
      console.log("Transaction date updated successfully.");
  } catch (error) {
      console.error("Error updating transaction date:", error);
  }
}

// Function to delete a transaction based on the transaction id
async function deleteTransaction(transactionId) {
    try {
        await realTransactionSchema.findByIdAndDelete(transactionId);
        console.log("Transaction deleted successfully.");
    } catch (error) {
        console.error("Error deleting transaction:", error);
    }
}

// Function to delete all transactions belonging to a certain username
async function deleteTransactionsByUsername(usernameValue) {
  try {
    usernameValue = usernameValue.toLowerCase();
      await realTransactionSchema.deleteMany({ username: username });
      console.log(`Transactions belonging to username ${username} deleted successfully.`);
  } catch (error) {
      console.error("Error deleting transactions:", error);
  }
}


// // Testing the fucking new crud shit bullshit 
// insertTransaction('JohnDoe', 'income', 'salary', 'Monthly salary', 5000, new Date());
// insertTransaction('RLATKSK', 'expense', 'groceries', 'Weekly grocery shopping', 200, new Date());
// insertTransaction('AliceSmith', 'income', 'freelance', 'Freelance work payment', 1000, new Date());
// insertTransaction('BobJohnson', 'expense', 'rent', 'Monthly rent payment', 1500, new Date());
// insertTransaction('EvaMiller', 'income', 'investment', 'Dividend income', 300, new Date());
// insertTransaction('SamJones', 'expense', 'utilities', 'Electricity bill', 100, new Date());
// insertTransaction('EmilyBrown', 'income', 'bonus', 'Year-end bonus', 2000, new Date());
// insertTransaction('MichaelDavis', 'expense', 'entertainment', 'Concert tickets', 150, new Date());
// insertTransaction('SophiaWilson', 'income', 'commission', 'Sales commission', 700, new Date());
// insertTransaction('OliverTaylor', 'expense', 'dining', 'Dinner with friends', 50, new Date());
// insertTransaction('ivander', 'income', 'salary', 'Monthly salary', 5000, new Date());

// insertTransaction('ivander', 'income', 'salary', 'Monthly salary', 7500, new Date());
// insertTransaction('ivander', 'expense', 'food', 'Monthly food', 5000, new Date());


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