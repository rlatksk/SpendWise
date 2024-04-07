function addIncome() {
    Swal.fire({
        title: "Add Income",
        html:
        '<label for="swal-input1">Income</label>' +
        '<input id="swal-input1" type="number" class="swal2-input" placeholder="Income">' +
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
                Swal.fire("Income Added", "", "success");
                setTimeout(() => {
                    location.reload();
                }, 2000);
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
        '<input id="swal-input1" type="number" class="swal2-input" placeholder="Expense">' +
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
                Swal.fire("Expense Added", "", "success");
                setTimeout(() => {
                    location.reload();
                }, 2000);
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire("Error", "Failed to add expense", "error");
            });
        }
    })
}