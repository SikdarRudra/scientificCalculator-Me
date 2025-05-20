class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.memory = 0;
        this.history = [];
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetScreen = false;
    }

    delete() {
        if (this.currentOperand.length === 1 || 
            (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.resetScreen) {
            this.currentOperand = '';
            this.resetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = `${this.currentOperand} ${this.operation}`;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }

        // Add to history
        this.addToHistory(`${this.previousOperand} ${this.currentOperand} = ${computation}`);
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.resetScreen = true;
    }

    addToHistory(calculation) {
        this.history.unshift(calculation);
        this.updateHistoryDisplay();
        
        // Limit history to 50 items
        if (this.history.length > 50) {
            this.history.pop();
        }
    }

    updateHistoryDisplay() {
        const historyItems = document.querySelector('.history-items');
        historyItems.innerHTML = '';
        
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.textContent = item;
            historyItem.addEventListener('click', () => {
                // Extract result from history item
                const result = item.split('=')[1].trim();
                this.currentOperand = result;
                this.updateDisplay();
            });
            historyItems.appendChild(historyItem);
        });
    }

    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
    }

    applyFunction(func) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        let result;
        switch (func) {
            case 'sin':
                result = Math.sin(current);
                break;
            case 'cos':
                result = Math.cos(current);
                break;
            case 'tan':
                result = Math.tan(current);
                break;
            case 'log':
                result = Math.log10(current);
                break;
            case 'ln':
                result = Math.log(current);
                break;
            case '√':
                result = Math.sqrt(current);
                break;
            case '!':
                result = this.factorial(current);
                break;
            case 'e':
                result = Math.exp(current);
                break;
            case '10^x':
                result = Math.pow(10, current);
                break;
            default:
                return;
        }
        
        this.addToHistory(`${func}(${current}) = ${result}`);
        this.currentOperand = result.toString();
        this.resetScreen = true;
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    addConstant(constant) {
        switch (constant) {
            case 'π':
                this.currentOperand = Math.PI.toString();
                break;
            case 'e':
                this.currentOperand = Math.E.toString();
                break;
        }
        this.resetScreen = true;
    }

    addParenthesis(parenthesis) {
        if (this.resetScreen) {
            this.currentOperand = '';
            this.resetScreen = false;
        }
        this.currentOperand += parenthesis;
    }

    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
    }

    memoryOperation(op) {
        const current = parseFloat(this.currentOperand) || 0;
        
        switch (op) {
            case 'add':
                this.memory += current;
                break;
            case 'subtract':
                this.memory -= current;
                break;
            case 'recall':
                this.currentOperand = this.memory.toString();
                break;
            case 'clear':
                this.memory = 0;
                break;
        }
        
        // Animate memory button
        const btn = document.querySelector(`[data-memory="${op}"]`);
        btn.classList.add('memory-active');
        setTimeout(() => {
            btn.classList.remove('memory-active');
        }, 300);
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        this.previousOperandElement.textContent = this.previousOperand;
        
        // Add animation to display changes
        this.currentOperandElement.classList.add('display-update');
        setTimeout(() => {
            this.currentOperandElement.classList.remove('display-update');
        }, 200);
    }
}

// DOM Elements
const numberButtons = document.querySelectorAll('[data-action="number"]');
const operationButtons = document.querySelectorAll('[data-action="operation"]');
const equalsButton = document.querySelector('[data-action="equals"]');
const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const functionButtons = document.querySelectorAll('[data-action="function"]');
const constantButtons = document.querySelectorAll('[data-action="constant"]');
const parenthesisButtons = document.querySelectorAll('[data-action="parenthesis"]');
const percentageButton = document.querySelector('[data-action="percentage"]');
const memoryButtons = document.querySelectorAll('[data-action="memory"]');
const previousOperandElement = document.querySelector('.previous-operand');
const currentOperandElement = document.querySelector('.current-operand');
const historyBtn = document.querySelector('.history-btn');
const historyPanel = document.querySelector('.history-panel');
const closeHistory = document.querySelector('.close-history');
const clearHistoryBtn = document.querySelector('.clear-history');
const themeButtons = document.querySelectorAll('.theme-btn');

// Initialize Calculator
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.textContent);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.textContent);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

functionButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.applyFunction(button.textContent);
        calculator.updateDisplay();
    });
});

constantButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.addConstant(button.textContent);
        calculator.updateDisplay();
    });
});

parenthesisButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.addParenthesis(button.textContent);
        calculator.updateDisplay();
    });
});

percentageButton.addEventListener('click', () => {
    calculator.percentage();
    calculator.updateDisplay();
});

memoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.memoryOperation(button.dataset.memory);
        calculator.updateDisplay();
    });
});

historyBtn.addEventListener('click', () => {
    historyPanel.classList.add('active');
});

closeHistory.addEventListener('click', () => {
    historyPanel.classList.remove('active');
});

clearHistoryBtn.addEventListener('click', () => {
    calculator.clearHistory();
});

// Theme Switching
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        themeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Set theme variables
        const theme = button.dataset.theme;
        document.documentElement.style.setProperty('--bg-color', `var(--${theme}-bg-color)`);
        document.documentElement.style.setProperty('--display-color', `var(--${theme}-display-color)`);
        document.documentElement.style.setProperty('--button-color', `var(--${theme}-button-color)`);
        document.documentElement.style.setProperty('--operation-color', `var(--${theme}-operation-color)`);
        document.documentElement.style.setProperty('--function-color', `var(--${theme}-function-color)`);
        document.documentElement.style.setProperty('--hover-color', `var(--${theme}-hover-color)`);
        document.documentElement.style.setProperty('--text-color', `var(--${theme}-text-color)`);
        document.documentElement.style.setProperty('--shadow-color', `var(--${theme}-shadow-color)`);
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '.') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        calculator.chooseOperation(
            e.key === '*' ? '×' : 
            e.key === '/' ? '÷' : e.key
        );
        calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    } else if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    } else if (e.key === '(' || e.key === ')') {
        calculator.addParenthesis(e.key);
        calculator.updateDisplay();
    } else if (e.key === '%') {
        calculator.percentage();
        calculator.updateDisplay();
    } else if (e.key === 'm' || e.key === 'M') {
        // Memory operations
        if (e.shiftKey) {
            calculator.memoryOperation('add');
        } else if (e.altKey) {
            calculator.memoryOperation('subtract');
        } else if (e.ctrlKey) {
            calculator.memoryOperation('clear');
        } else {
            calculator.memoryOperation('recall');
        }
        calculator.updateDisplay();
    } else if (e.key === 'h' || e.key === 'H') {
        // Toggle history panel
        historyPanel.classList.toggle('active');
    }
});