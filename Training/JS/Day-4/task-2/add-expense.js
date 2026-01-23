let currentStep = 1;
let editingId = null;

$(document).ready(function() {
    // Check if editing
    const urlParams = new URLSearchParams(window.location.search);
    editingId = urlParams.get('edit');
    
    if (editingId) {
        loadExpenseForEdit(editingId);
    }
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    $('#date').val(today);
});

// Load expense for editing
function loadExpenseForEdit(id) {
    const expenses = getExpenses();
    const expense = expenses.find(e => e.id === id);
    
    if (expense) {
        $('#expenseTitle').val(expense.title);
        $('#amount').val(expense.amount);
        $(`input[name="expenseType"][value="${expense.type}"]`).prop('checked', true);
        $('#category').val(expense.category);
        $('#date').val(expense.date);
        $('#paymentMode').val(expense.paymentMode);
    }
}

// Validate step 1
function validateStep1() {
    let isValid = true;
    
    // Clear previous errors
    $('.error').text('');
    
    // Validate title
    const title = $('#expenseTitle').val().trim();
    if (title === '') {
        $('#titleError').text('Please enter expense title');
        isValid = false;
    }
    
    // Validate amount
    const amount = $('#amount').val();
    if (amount === '' || parseFloat(amount) <= 0) {
        $('#amountError').text('Please enter valid amount');
        isValid = false;
    }
    
    return isValid;
}

// Validate step 2
function validateStep2() {
    let isValid = true;
    
    // Clear previous errors
    $('.error').text('');
    
    // Validate category
    const category = $('#category').val();
    if (category === '') {
        $('#categoryError').text('Please select a category');
        isValid = false;
    }
    
    // Validate date
    const date = $('#date').val();
    if (date === '') {
        $('#dateError').text('Please select a date');
        isValid = false;
    }
    
    // Validate payment mode
    const paymentMode = $('#paymentMode').val();
    if (paymentMode === '') {
        $('#paymentError').text('Please select payment mode');
        isValid = false;
    }
    
    return isValid;
}

// Next step
function nextStep(step) {
    if (step === 2) {
        if (!validateStep1()) {
            return;
        }
    } else if (step === 3) {
        if (!validateStep2()) {
            return;
        }
        updateConfirmation();
    }
    
    // Hide current step
    $('.form-step').removeClass('active');
    $('.step').removeClass('active');
    
    // Show next step
    $(`#step${step}`).addClass('active');
    $(`.step[data-step="${step}"]`).addClass('active');
    
    currentStep = step;
}

// Previous step
function prevStep(step) {
    // Hide current step
    $('.form-step').removeClass('active');
    $('.step').removeClass('active');
    
    // Show previous step
    $(`#step${step}`).addClass('active');
    $(`.step[data-step="${step}"]`).addClass('active');
    
    currentStep = step;
}

// Update confirmation details
function updateConfirmation() {
    const title = $('#expenseTitle').val();
    const amount = $('#amount').val();
    const type = $('input[name="expenseType"]:checked').val();
    const category = $('#category').val();
    const date = $('#date').val();
    const paymentMode = $('#paymentMode').val();
    const currency = getCurrencySymbol();
    
    $('#confirmTitle').text(title);
    $('#confirmAmount').text(formatAmount(parseFloat(amount), currency));
    $('#confirmType').text(type);
    $('#confirmCategory').text(category);
    $('#confirmDate').text(date);
    $('#confirmPayment').text(paymentMode);
}

// Save expense
function saveExpense() {
    const expenses = getExpenses();
    const currency = getCurrencySymbol();
    
    const expense = {
        id: editingId || Date.now().toString(),
        title: $('#expenseTitle').val().trim(),
        amount: parseFloat($('#amount').val()),
        type: $('input[name="expenseType"]:checked').val(),
        category: $('#category').val(),
        date: $('#date').val(),
        paymentMode: $('#paymentMode').val(),
        currency: currency
    };
    
    if (editingId) {
        // Update existing expense
        const index = expenses.findIndex(e => e.id === editingId);
        if (index !== -1) {
            // Keep the original currency
            expense.currency = expenses[index].currency;
            expenses[index] = expense;
        }
    } else {
        // Add new expense
        expenses.push(expense);
    }
    
    saveExpenses(expenses);
    
    // Show success message
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: editingId ? 'Expense updated successfully!' : 'Expense added successfully!',
        confirmButtonColor: '#27ae60'
    }).then(() => {
        window.location.href = 'index.html';
    });
}

// jQuery validation setup
$.validator.addMethod("greaterThanZero", function(value, element) {
    return parseFloat(value) > 0;
}, "Amount must be greater than zero");

$('#expenseForm').validate({
    rules: {
        expenseTitle: {
            required: true,
            minlength: 2
        },
        amount: {
            required: true,
            number: true,
            greaterThanZero: true
        },
        category: {
            required: true
        },
        date: {
            required: true
        },
        paymentMode: {
            required: true
        }
    },
    messages: {
        expenseTitle: {
            required: "Please enter expense title",
            minlength: "Title must be at least 2 characters"
        },
        amount: {
            required: "Please enter amount",
            number: "Please enter valid number"
        },
        category: "Please select a category",
        date: "Please select a date",
        paymentMode: "Please select payment mode"
    },
    errorPlacement: function(error, element) {
        error.insertAfter(element);
    }
});