const realTransactionSchema = require('../db-schema/Transaction.js');

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
// insertTransaction('rlatksk', 'income', 'salary', 'Monthly salary', 5000, '2024-03-01');
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

module.exports = {
    insertTransaction,
    getTransactionById,
    getAllTransactions,
    updateTransactionAmount,
    updateTransactionCategory,
    updateTransactionType,
    updateTransactionDate,
    updateTransactionNote,
    deleteTransaction,
    deleteTransactionsByUsername
  }