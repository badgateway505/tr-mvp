import currencyRates from '../data/currencyRates.json';

/**
 * Get the exchange rate for a given currency code relative to EUR
 * @param code - The currency code (e.g., 'EUR', 'ZAR')
 * @returns The exchange rate as a number, or undefined if currency not found
 */
export function getCurrencyRate(code: string): number | undefined {
  return currencyRates[code as keyof typeof currencyRates];
}

/**
 * Get all available currency codes
 * @returns Array of available currency codes
 */
export function getAvailableCurrencies(): string[] {
  return Object.keys(currencyRates);
}
