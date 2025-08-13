import { getCountryRule } from './loadRequirements';
import type { CountryCode } from '../types/requirements';

/**
 * Currency utilities for deriving currency information from country rules
 */

/**
 * Derives the currency code for the amount input based on sumsubCountry
 * @param sumsubCountry - The country code of the Sumsub VASP
 * @returns The currency code (e.g., 'EUR', 'ZAR') or null if country not found
 */
export function getCurrencyForAmount(sumsubCountry: CountryCode): string | null {
  try {
    const countryRule = getCountryRule(sumsubCountry);
    return countryRule?.currency || null;
  } catch (error) {
    // If country rule cannot be loaded, return null
    console.warn(`Could not load currency for country: ${sumsubCountry}`, error);
    return null;
  }
}

/**
 * Gets the currency symbol for display purposes
 * @param currencyCode - The currency code (e.g., 'EUR', 'ZAR')
 * @returns The currency symbol or the code itself if symbol not found
 */
export function getCurrencySymbol(currencyCode: string): string {
  const symbols: Record<string, string> = {
    'EUR': '€',
    'ZAR': 'R',
    'USD': '$',
    'GBP': '£',
  };
  
  return symbols[currencyCode] || currencyCode;
}

/**
 * Formats amount with currency for display
 * @param amount - The amount as integer
 * @param currencyCode - The currency code
 * @returns Formatted string with currency (e.g., "€1,000" or "R5,000")
 */
export function formatAmountWithCurrency(amount: number, currencyCode: string): string {
  const symbol = getCurrencySymbol(currencyCode);
  const formattedAmount = amount.toLocaleString();
  
  // European style: symbol after amount for some currencies
  if (currencyCode === 'EUR') {
    return `${formattedAmount} ${symbol}`;
  }
  
  // Default: symbol before amount
  return `${symbol}${formattedAmount}`;
}
