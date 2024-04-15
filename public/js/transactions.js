$(document).ready(function () {
  $("#select-date-range").click(selectDateRange);
  $(".download-btn").click(downloadTransactionsCSV);
  $("#transactions-table").DataTable({
    columnDefs: [
      {
        targets: [4],
        orderable: false,
        searchable: false,
      },
    ],
    order: [[0, "desc"]],
  });

  $(".dataTables_info").empty();

  function loadTransactionsIntoTable(transactions) {
    $("#transactions-table").DataTable().clear();

    transactions.forEach(function (transaction) {
      var amount =
        transaction.type === "expense"
          ? -transaction.amount
          : transaction.amount;
      var date = new Date(transaction.date).toISOString().slice(0, 10);
      var formattedAmount = "$" + amount.toFixed(2);
      $("#transactions-table")
        .DataTable()
        .row.add([
          date,
          formattedAmount,
          transaction.category,
          transaction.notes,
          `<a onclick="editTransaction('${transaction._id}')">Edit</a> <a onclick="deleteTransaction('${transaction._id}')">Delete</a>`,
        ]);
    });
    

    $("#transactions-table").DataTable().draw();

    let totalTransactions = transactions.length;
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function (transaction) {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpense -= transaction.amount;
      }
    });

    $(".total-transactions h3").text(totalTransactions);
    $(".total-income h3").text("$" + totalIncome.toFixed(2));
    $(".total-expense h3").text("$" + totalExpense.toFixed(2));
  }

  $("#today").click(function () {
    $.ajax({
      url: "/transactions/today",
      type: "GET",
      success: loadTransactionsIntoTable,
      error: function (xhr, status, error) {
        console.error("Error fetching today's transactions:", error);
      },
    });
  });

  $("#last-7-days").click(function () {
    $.ajax({
      url: "/transactions/last7days",
      type: "GET",
      success: loadTransactionsIntoTable,
      error: function (xhr, status, error) {
        console.error("Error fetching last 7 days' transactions:", error);
      },
    });
  });

  $("#last-30-days").click(function () {
    $.ajax({
      url: "/transactions/last30days",
      type: "GET",
      success: loadTransactionsIntoTable,
      error: function (xhr, status, error) {
        console.error("Error fetching last 30 days' transactions:", error);
      },
    });
  });

  function selectDateRange() {
    Swal.fire({
      title: "<strong>Select Date Range</strong>",
      icon: "info",
      html: `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="display: flex; flex-direction: column; justify-content: center;">
                        <label for="start-date" style="margin-right: 10px;">Start Date:</label>
                        <input type="date" id="start-date" class="swal2-input">
                    </div>
                    <div style="display: flex; flex-direction: column; justify-content: center; margin-top: 20px;">
                        <label for="end-date" style="margin-right: 10px;">End Date:</label>
                        <input type="date" id="end-date" class="swal2-input">
                    </div>
                </div>
            `,
      focusConfirm: false,
      confirmButtonText: "Submit",
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#d33",
      showCancelButton: true,
      preConfirm: () => {
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;
        if (!startDate || !endDate) {
          Swal.showValidationMessage("Please select both start and end dates");
          return false;
        }
        getDateRangeTransactions(startDate, endDate);
      },
    });
  }

  function getDateRangeTransactions(startDate, endDate) {
    $.ajax({
      url: "/transactions/range",
      type: "GET",
      data: { start: startDate, end: endDate },
      success: loadTransactionsIntoTable,
      error: function (xhr, status, error) {
        console.error(
          "Error fetching transactions for selected date range:",
          error
        );
      },
    });
  }

  function downloadTransactionsCSV() {
    $.ajax({
      url: "/api/transactions/csv",
      type: "GET",
      success: function (data) {
        const csvBlob = new Blob([data], { type: "text/csv;charset=utf-8;" });
        const csvUrl = URL.createObjectURL(csvBlob);
        const downloadLink = document.createElement("a");
        downloadLink.href = csvUrl;
        downloadLink.setAttribute("download", "transactions.csv");
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      },
      error: function (xhr, status, error) {
        console.error("Error downloading transactions CSV:", error);
      },
    });
  }

  // Function to filter transactions by type (income or expense)
  $("#filter-income").click(function () {
    var table = $("#transactions-table").DataTable();
    table.column(1).search("^[^\\-]", true, false).draw();
  });

  $("#filter-expense").click(function () {
    var table = $("#transactions-table").DataTable();
    table.column(1).search("^\\-", true, false).draw();
  });

  $("#filter-reset").click(function () {
    var table = $("#transactions-table").DataTable();
    table.search("").columns().search("").draw();
  });
});
