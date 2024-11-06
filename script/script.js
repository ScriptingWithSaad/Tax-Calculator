const form = document.getElementById('tax-form');
const historyContainer = document.getElementById('history-container');
const clearHistoryButton = document.getElementById('clear-history');
let historyData = JSON.parse(localStorage.getItem('taxCalculatorHistory')) || [];

// Load history from localStorage
updateHistory();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const incomeInput = document.getElementById('income');
    const taxRateInput = document.getElementById('tax-rate');
    const income = parseFloat(incomeInput.value);
    const taxRate = parseFloat(taxRateInput.value);
    const tax = (income * (taxRate / 100)).toFixed(2);

    const newHistoryItem = {
        id: Date.now(), // Add unique ID for each entry
        income,
        taxRate,
        tax: parseFloat(tax)
    };

    // Add new item to the beginning of the array
    historyData.unshift(newHistoryItem);

    // Keep only the last 10 items
    if (historyData.length > 10) {
        historyData.pop();
    }

    // Save to localStorage
    localStorage.setItem('taxCalculatorHistory', JSON.stringify(historyData));

    // Update display
    updateHistory();

    // Reset form
    form.reset();
    incomeInput.focus();
});

clearHistoryButton.addEventListener('click', () => {
    // Add confirmation dialog
    if (confirm('Are you sure you want to clear all history?')) {
        historyData = [];
        localStorage.setItem('taxCalculatorHistory', JSON.stringify(historyData));
        updateHistory();
    }
});

function updateHistory() {
    historyContainer.innerHTML = '';

    historyData.forEach(entry => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerHTML = `
            <div>
                <p class="tax">Income: $${entry.income.toLocaleString()}</p>
                <p>Tax Rate: ${entry.taxRate}%</p>
                <p class="tax">Tax: $${entry.tax.toLocaleString()}</p>
            </div>
            <button class="delete-btn" data-id="${entry.id}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                    </path>
                </svg>
            </button>
        `;
        historyContainer.appendChild(historyItem);
    });

    // Add delete button event listeners
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            historyData = historyData.filter(item => item.id !== id);
            localStorage.setItem('taxCalculatorHistory', JSON.stringify(historyData));
            updateHistory();
        });
    });
}