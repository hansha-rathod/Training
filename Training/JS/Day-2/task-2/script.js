$(document).ready(function () {

    let currentInput = '';
    let expression = '';
    let shouldResetInput = false;

    function updateDisplay(value) {
        $('#display').text(value || '0');
    }

    function clear() {
        currentInput = '';
        expression = '';
        shouldResetInput = false;
        updateDisplay('0');
    }

    function inputNumber(num) {
        if (shouldResetInput) {
            currentInput = num;
            shouldResetInput = false;
        } else {
            currentInput += num;
        }

        updateDisplay(expression + currentInput);
    }

    function inputDecimal() {
        if (shouldResetInput) {
            currentInput = '0.';
            shouldResetInput = false;
        } else if (!currentInput.includes('.')) {
            currentInput += '.';
        }

        updateDisplay(expression + currentInput);
    }

    function inputOperator(op) {
        if (currentInput === '' && expression !== '') {
            // replace last operator
            expression = expression.slice(0, -3) + ` ${op} `;
        } else {
            expression += currentInput + ` ${op} `;
            currentInput = '';
        }

        shouldResetInput = false;
        updateDisplay(expression);
    }

    function calculatePercentage() {
        if (currentInput === '') return;

        const value = parseFloat(currentInput) / 100;
        currentInput = value.toString();
        updateDisplay(expression + currentInput);
    }

    function calculate() {
        if (currentInput === '' && expression === '') return;

        let finalExpression = expression + currentInput;

        try {
            let result = eval(finalExpression);
            result = Math.round(result * 100000000) / 100000000;

            updateDisplay(result);
            currentInput = result.toString();
            expression = '';
            shouldResetInput = true;

        } catch {
            updateDisplay('Error');
            clear();
        }
    }

    // Button clicks
    $('.btn-calc').on('click', function () {
        const value = $(this).attr('data-value');

        if (value >= '0' && value <= '9') {
            inputNumber(value);
        } else if (value === '.') {
            inputDecimal();
        } else if (value === 'C') {
            clear();
        } else if (value === '=') {
            calculate();
        } else if (value === '%') {
            calculatePercentage();
        } else {
            inputOperator(value);
        }
    });

    // Keyboard support
    $(document).on('keydown', function (e) {
        if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
        else if (e.key === '.') inputDecimal();
        else if ('+-*/'.includes(e.key)) inputOperator(e.key);
        else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            calculate();
        }
        else if (e.key === '%') calculatePercentage();
        else if (e.key === 'Escape') clear();
        else if (e.key === 'Backspace') {
            currentInput = currentInput.slice(0, -1);
            updateDisplay(expression + currentInput);
        }
    });

});
