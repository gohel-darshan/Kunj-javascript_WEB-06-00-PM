const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from');
const toCurrency = document.getElementById('to');
const convertBtn = document.getElementById('convert-btn');
const swapBtn = document.getElementById('swap');
const convertedAmount = document.getElementById('converted-amount');
const rateInfo = document.getElementById('rate-info');

const API_KEY = '572d09ca35-1dc39ce73e-svn0a4';
const API_URL = `https://api.exchangerate-api.com/v4/latest/`;

// Function to fetch exchange rates
async function getExchangeRate(from, to) {
    try {
        const response = await fetch(`${API_URL}${from}`);
        const data = await response.json();
        return data.rates[to];
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return null;
    }
}

// Function to convert currency
async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    try {
        const rate = await getExchangeRate(from, to);
        if (rate) {
            const result = (amount * rate).toFixed(2);
            convertedAmount.textContent = result;
            rateInfo.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
        } else {
            alert('Error converting currency. Please try again.');
        }
    } catch (error) {
        alert('Error converting currency. Please try again.');
    }
}

// Function to swap currencies
function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    convertCurrency();
}

// Event Listeners
convertBtn.addEventListener('click', convertCurrency);
swapBtn.addEventListener('click', swapCurrencies);

// Convert on input change
amountInput.addEventListener('input', convertCurrency);
fromCurrency.addEventListener('change', convertCurrency);
toCurrency.addEventListener('change', convertCurrency);

// Initial conversion
convertCurrency(); 