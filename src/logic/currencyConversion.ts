import { getCurrencyRate } from './getCurrencyRate';

export interface CurrencyConversion {
  originalAmount: number;
  originalCurrency: string;
  eurAmount: number;
  exchangeRate: number;
}

/**
 * Convert an amount from a given currency to EUR
 * @param amount - The amount in the original currency (integer)
 * @param currencyCode - The currency code to convert from
 * @returns CurrencyConversion object with conversion details
 */
export function convertToEUR(amount: number, currencyCode: string): CurrencyConversion | undefined {
  const rate = getCurrencyRate(currencyCode);
  if (rate === undefined) {
    return undefined;
  }

  const eurAmount = Math.round(amount * rate);

  return {
    originalAmount: amount,
    originalCurrency: currencyCode,
    eurAmount,
    exchangeRate: rate
  };
}

/**
 * Get the exchange rate for a currency relative to EUR
 * @param currencyCode - The currency code to get the rate for
 * @returns The exchange rate or undefined if not found
 */
export function getExchangeRate(currencyCode: string): number | undefined {
  return getCurrencyRate(currencyCode);
}

/**
 * Format a currency amount with proper decimal places
 * @param amount - The amount to format
 * @param currencyCode - The currency code for formatting
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  // For EUR, show 2 decimal places
  if (currencyCode === 'EUR') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  // For other currencies, show as integer (as per requirements)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format the converted EUR amount
 * @param eurAmount - The EUR amount (integer)
 * @returns Formatted EUR string
 */
export function formatEURAmount(eurAmount: number): string {
  return formatCurrency(eurAmount, 'EUR');
}

/**
 * Get conversion summary for display purposes
 * @param amount - The original amount
 * @param currencyCode - The original currency code
 * @returns Formatted conversion summary or undefined if conversion failed
 */
export function getConversionSummary(amount: number, currencyCode: string): string | undefined {
  const conversion = convertToEUR(amount, currencyCode);
  if (!conversion) {
    return undefined;
  }

  const originalFormatted = formatCurrency(amount, currencyCode);
  const eurFormatted = formatEURAmount(conversion.eurAmount);

  return `${originalFormatted} = ${eurFormatted}`;
}

/**
 * Check if a currency is supported for conversion
 * @param currencyCode - The currency code to check
 * @returns True if the currency is supported
 */
export function isCurrencySupported(currencyCode: string): boolean {
  return getCurrencyRate(currencyCode) !== undefined;
}

/**
 * Get all supported currencies
 * @returns Array of supported currency codes
 */
export function getSupportedCurrencies(): string[] {
  // This would typically come from the currency rates data
  // For now, we'll use the ones we know about
  return ['EUR', 'ZAR'];
}
