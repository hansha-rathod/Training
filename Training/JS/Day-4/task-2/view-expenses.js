$(document).ready(function() {
    displayExpenses();
    
    // Search functionality
    $('#searchBox').on('keyup', function() {
        filterAndDisplayExpenses();
    });
    
    // Filter functionality
    $('#filterCategory').on('change', function() {
        filterAndDisplayExpenses();
    });
    
    // Sort functionality
    $('#sortBy').on('change', function() {
        filterAndDisplayExpenses();
    });
});

// Display expenses
function displayExpenses() {
    const expenses = getExpenses();
    const tbody = $('#expenseTableBody');
    tbody.empty();
    
    if (expenses.length === 0) {
        tbody.html('<tr><td colspan="7" class="no-data">No expenses added</td></tr>');
        return;
    }
    
    expenses.forEach(expense => {
        const row = createExpenseRow(expense);
        tbody.append(row);
    });
}

// Create expense row
function createExpenseRow(expense) {
    const currency = expense.currency || getCurrencySymbol();
    const typeClass = expense.type === 'Income' ? 'style="color: #27ae60; font-weight: 600;"' : 'style="color: #e74c3c; font-weight: 600;"';
    
    return `
        <tr data-id="${expense.id}">
            <td>${expense.title}</td>
            <td>${formatAmount(expense.amount, currency)}</td>
            <td ${typeClass}>${expense.type}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>${expense.paymentMode}</td>
            <td>
                <button class="btn-edit" onclick="editExpense('${expense.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteExpense('${expense.id}')">Delete</button>
            </td>
        </tr>
    `;
}

// Filter and display expenses
function filterAndDisplayExpenses() {
    let expenses = getExpenses();
    
    // Apply search filter
    const searchTerm = $('#searchBox').val().toLowerCase();
    if (searchTerm) {
        expenses = expenses.filter(expense => 
            expense.title.toLowerCase().includes(searchTerm) ||
            expense.category.toLowerCase().includes(searchTerm) ||
            expense.type.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    const categoryFilter = $('#filterCategory').val();
    if (categoryFilter !== 'All') {
        expenses = expenses.filter(expense => expense.category === categoryFilter);
    }
    
    // Apply sorting
    const sortBy = $('#sortBy').val();
    expenses.sort((a, b) => {
        if (sortBy === 'Date') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'Amount') {
            return b.amount - a.amount;
        } else if (sortBy === 'Title') {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });
    
    // Display filtered expenses
    const tbody = $('#expenseTableBody');
    tbody.empty();
    
    if (expenses.length === 0) {
        tbody.html('<tr><td colspan="7" class="no-data">No expenses found</td></tr>');
        return;
    }
    
    expenses.forEach(expense => {
        const row = createExpenseRow(expense);
        tbody.append(row);
    });
}

// Edit expense
function editExpense(id) {
    window.location.href = `add-expense.html?edit=${id}`;
}

// Delete expense
function deleteExpense(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let expenses = getExpenses();
            expenses = expenses.filter(expense => expense.id !== id);
            saveExpenses(expenses);
            
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Expense has been deleted.',
                confirmButtonColor: '#27ae60'
            }).then(() => {
                filterAndDisplayExpenses();
                updateDashboard();
            });
        }
    });
}