function addIncome() {
    Swal.fire({
        title: "Add Income",
        html:
        '<label for="swal-input1">Income</label>' +
        '<input id="swal-input1" type="number" class="swal2-input" placeholder="Income">' +
        '<label for="swal-input2">Notes </label>' +
        '<input id="swal-input2" class="swal2-input" placeholder="Notes">',
        showCancelButton: true,
        confirmButtonText: "Add",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading() 
    })
}

function addExpense() {
    Swal.fire({
        title: "Add Expense",
        html:
        '<label for="swal-input1">Expense</label>' +
        '<input id="swal-input1" type="number" class="swal2-input" placeholder="Expense">' +
        '<label for="swal-input2">Notes </label>' +
        '<input id="swal-input2" class="swal2-input" placeholder="Notes">',
        showCancelButton: true,
        confirmButtonText: "Add",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading() 
    })
}