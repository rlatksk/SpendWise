document.addEventListener("DOMContentLoaded", function () {
    const transactionsData = JSON.parse(document.getElementById('doughnutChartTransactionTypes').dataset.transactions);

    // Generate labels and data arrays for the past 30 days
    const { labels, incomeData, expenseData } = generateChartData(transactionsData);

    // Create Chart.js instance for transaction types
    var ctxTransactionTypes = document.getElementById('doughnutChartTransactionTypes').getContext('2d');
    var doughnutChartTransactionTypes = new Chart(ctxTransactionTypes, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                label: 'Transaction Types',
                data: generateTypeData(transactionsData),
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)']
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
            }
        }
    });

    // Create Chart.js instance for categories
    var ctxCategories = document.getElementById('doughnutChartCategories').getContext('2d');
    var doughnutChartCategories = new Chart(ctxCategories, {
        type: 'doughnut',
        data: {
            labels: Object.keys(generateCategoryData(transactionsData)),
            datasets: [{
                label: 'Categories',
                data: Object.values(generateCategoryData(transactionsData)),
                backgroundColor: generateRandomColors(Object.keys(generateCategoryData(transactionsData)).length)
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
            }
        }
    });

    // Create Chart.js instance for line chart (Income & Expense)
    var ctxLineChart = document.getElementById('lineChartIncomeExpense').getContext('2d');
    var lineChartIncomeExpense = new Chart(ctxLineChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Income',
                data: incomeData,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 0.6)',
                tension: 0.1
            },
            {
                label: 'Expense',
                data: expenseData,
                fill: false,
                borderColor: 'rgba(255, 99, 132, 0.6)',
                tension: 0.1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Function to generate data for doughnut chart (Transaction Types)
    function generateTypeData(transactions) {
        let totalIncome = 0;
        let totalExpense = 0;
    
        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else {
                totalExpense += transaction.amount;
            }
        });
    
        return [totalIncome, totalExpense];
    }    

    // Function to generate data for doughnut chart (Categories)
    function generateCategoryData(transactions) {
        const categoryAmounts = {};
    
        transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
                const category = transaction.category.toLowerCase();
                // If the category doesn't exist yet, initialize it with the transaction amount
                if (!categoryAmounts[category]) {
                    categoryAmounts[category] = transaction.amount;
                } else {
                    // If the category exists, add the transaction amount to its total
                    categoryAmounts[category] += transaction.amount;
                }
            }
        });
    
        return categoryAmounts;
    }    

    // Function to generate random background colors for doughnut chart
    function generateRandomColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`);
        }
        return colors;
    }

    // Function to generate labels and data arrays for the past 30 days for line chart
    function generateChartData(transactions) {
        const labels = [];
        const incomeData = [];
        const expenseData = [];
        const currentDate = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            labels.push(formatDate(date));

            const transactionsOnDate = transactions.filter(transaction => isSameDay(new Date(transaction.date), date));
            if (transactionsOnDate.length > 0) {
                incomeData.push(transactionsOnDate.filter(transaction => transaction.type === 'income').reduce((total, transaction) => total + transaction.amount, 0));
                expenseData.push(transactionsOnDate.filter(transaction => transaction.type === 'expense').reduce((total, transaction) => total + transaction.amount, 0));
            } else {
                incomeData.push(0);
                expenseData.push(0);
            }
        }
        return { labels, incomeData, expenseData };
    }

    // Function to check if two dates are the same day
    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    // Function to format date as "DD-MM"
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}-${month}`;
    }
});
