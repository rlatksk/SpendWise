function addIncome() {
    Swal.fire({
        title: "Add Income",
        html:
        '<label for="swal-input1">Income</label>' +
        '<input id="swal-input1" type="number" class="swal2-input" placeholder="Amount">' +
        '<label for="swal-input2">Category</label>' +
        '<input id="swal-input2" class="swal2-input" placeholder="Category">' +
        '<label for="swal-input3">Notes </label>' +
        '<input id="swal-input3" class="swal2-input" placeholder="Notes">',
        showCancelButton: true,
        confirmButtonText: "Add",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: () => {
            const income = document.getElementById('swal-input1').value;
            const category = document.getElementById('swal-input2').value;
            const notes = document.getElementById('swal-input3').value;
            
            // POST request
            return fetch('/api/insertTransaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'income',
                    category: category, 
                    notes: notes,
                    amount: income,
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                console.log(data); 
                Swal.fire({
                    title: "Income Added",
                    icon: "success",
                    showConfirmButton: false,
                    allowOutsideClick: false
                  });
                setTimeout(() => {
                    location.reload();
                }, 1500);
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire("Error", "Failed to add income", "error");
            });
        }
    })
}

function addExpense() {
    Swal.fire({
        title: "Add Expense",
        html:
        '<label for="swal-input1">Expense</label>' +
        '<input id="swal-input1" type="number" class="swal2-input" placeholder="Amount">' +
        '<label for="swal-input2">Category</label>' +
        '<input id="swal-input2" class="swal2-input" placeholder="Category">' +
        '<label for="swal-input3">Notes </label>' +
        '<input id="swal-input3" class="swal2-input" placeholder="Notes">',
        showCancelButton: true,
        confirmButtonText: "Add",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: () => {
            const expense = document.getElementById('swal-input1').value;
            const category = document.getElementById('swal-input2').value;
            const notes = document.getElementById('swal-input3').value;
            
            // POST request
            return fetch('/api/insertTransaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'expense',
                    category: category, 
                    notes: notes,
                    amount: expense,
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                console.log(data); 
                Swal.fire({
                    title: "Expense Added",
                    icon: "success",
                    showConfirmButton: false,
                    allowOutsideClick: false
                  });
                setTimeout(() => {
                    location.reload();
                }, 1500);
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire("Error", "Failed to add expense", "error");
            });
        }
    })
}

function deleteTransaction(transactionId) {
    Swal.fire({
      title: "Delete Transaction?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          const response = await fetch(`/api/deletetransaction/${transactionId}`, {
            method: 'DELETE'
          });
          const data = await response.json();
          if (response.ok) {
            return { success: true };
          } else if (response.status === 404) {
            // Handle the 404 case here
            return { success: true, message: 'Transaction not found, but deleted from the database' };
          } else {
            throw new Error(data.message || 'Failed to delete transaction');
          }
        } catch (error) {
          return { success: false, error: error.message };
        }
      }
    })
    .then(result => {
      console.log('Result value:', result.value);
      if (result.isConfirmed) {
        if (result.value.success) {
          Swal.fire({
            title: "Transaction Deleted",
            icon: "success",
            showConfirmButton: false,
            allowOutsideClick: false
          });
          setTimeout(() => {
            location.reload();
          }, 1500);
        } else {
          console.log('Result:', result);
        }
      } else if (result.isDismissed) {
        // User clicked the cancel button, do nothing
        return;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire("Error", "Failed to delete transaction", "error");
    });
  }
