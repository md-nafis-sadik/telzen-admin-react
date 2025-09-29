// utils/currency.js

// Default currency (exported as mutable)
let currentCurrency = 'USD';

// Currency symbol map (private)
const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

// Setter for currency
export const setCurrency = (currencyCode) => {
  if (CURRENCY_SYMBOLS[currencyCode]) {
    currentCurrency = currencyCode;
  } else {
    console.warn(`Unsupported currency: ${currencyCode}`);
  }
};

// Get current symbol
// Get symbol (optionally pass a currency code)
export const getSymbol = (currencyCode) =>
  CURRENCY_SYMBOLS[currencyCode || currentCurrency] || (currencyCode || currentCurrency);

// Format amount with current currency
export const format = (amount) => `${getSymbol()}${amount.toFixed(2)}`;

// Export current currency (read-only)
export const currency = () => currentCurrency;