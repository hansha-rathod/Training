// Fixed exchange rates (you can update these values periodically)
// We treat INR (₹) as the base currency
const EXCHANGE_RATES = {
    '₹': 1,         // INR
    '$': 83.50,     // 1 USD ≈ 83.50 INR
    '€': 90.20,     // 1 EUR ≈ 90.20 INR
    '£': 105.80,    // 1 GBP ≈ 105.80 INR
    // You can add more currencies here
};

// Convert amount from original currency to target currency
function convertToCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    
    const rateFrom = EXCHANGE_RATES[fromCurrency] || 1;
    const rateTo   = EXCHANGE_RATES[toCurrency]   || 1;
    
    // amount in base (INR) → amount in target currency
    const inBase = amount * rateFrom;
    return inBase / rateTo;
}

// Initialize storage with default values
function initializeStorage() {
    if (!localStorage.getItem('expenses')) {
        localStorage.setItem('expenses', JSON.stringify([]));
    }
    if (!localStorage.getItem('currency')) {
        localStorage.setItem('currency', '₹');
    }
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'light');
    }
}

// Get currency symbol
function getCurrencySymbol() {
    return localStorage.getItem('currency') || '₹';
}

// Get all expenses
function getExpenses() {
    const expenses = localStorage.getItem('expenses');
    return expenses ? JSON.parse(expenses) : [];
}

// Save expenses
function saveExpenses(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Calculate totals — converted to current currency
function calculateTotals() {
    const expenses = getExpenses();
    const currentCurrency = getCurrencySymbol();

    let totalIncome = 0;
    let totalExpenses = 0;

    expenses.forEach(expense => {
        const originalAmount = parseFloat(expense.amount);
        const originalCurrency = expense.currency || '₹'; // fallback

        const amountInCurrent = convertToCurrency(
            originalAmount,
            originalCurrency,
            currentCurrency
        );

        if (expense.type === 'Income') {
            totalIncome += amountInCurrent;
        } else {
            totalExpenses += amountInCurrent;
        }
    });

    const balance = totalIncome - totalExpenses;
    const transactions = expenses.length;

    return {
        totalIncome,
        totalExpenses,
        balance,
        transactions
    };
}

// Format amount with currency
function formatAmount(amount, currency) {
    return currency + amount.toFixed(2);
}

// Update dashboard — now shows everything in current currency only
function updateDashboard() {
    const totals = calculateTotals();
    const currency = getCurrencySymbol();

    $('#totalIncome').text(formatAmount(totals.totalIncome, currency));
    $('#totalExpenses').text(formatAmount(totals.totalExpenses, currency));
    $('#balance').text(formatAmount(totals.balance, currency));
    $('#transactions').text(totals.transactions);

    // Optional: color feedback for negative balance
    if (totals.balance < 0) {
        $('#balance').css('color', '#dc3545');
    } else {
        $('#balance').css('color', '#28a745');
    }
}

// Apply theme
function applyTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
        $('body').addClass('dark-mode');
    } else {
        $('body').removeClass('dark-mode');
    }
}

// Initialize on page load
$(document).ready(function() {
    initializeStorage();
    applyTheme();
    updateDashboard();   // ← important: call it here too
});