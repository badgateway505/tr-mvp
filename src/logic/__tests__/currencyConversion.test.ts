import { describe, it, expect } from 'vitest';
import {
  convertToEUR,
  getExchangeRate,
  formatCurrency,
  formatEURAmount,
  getConversionSummary,
  isCurrencySupported,
  getSupportedCurrencies,
} from '../currencyConversion';

describe('currencyConversion', () => {
  describe('convertToEUR', () => {
    it('should convert EUR to EUR (rate 1.0)', () => {
      const result = convertToEUR(1000, 'EUR');
      expect(result).toBeDefined();
      expect(result?.originalAmount).toBe(1000);
      expect(result?.originalCurrency).toBe('EUR');
      expect(result?.eurAmount).toBe(1000);
      expect(result?.exchangeRate).toBe(1.0);
    });

    it('should convert ZAR to EUR (rate 0.05)', () => {
      const result = convertToEUR(1000, 'ZAR');
      expect(result).toBeDefined();
      expect(result?.originalAmount).toBe(1000);
      expect(result?.originalCurrency).toBe('ZAR');
      expect(result?.eurAmount).toBe(50); // 1000 * 0.05 = 50
      expect(result?.exchangeRate).toBe(0.05);
    });

    it('should round ZAR conversion correctly', () => {
      const result = convertToEUR(1001, 'ZAR');
      expect(result?.eurAmount).toBe(50); // 1001 * 0.05 = 50.05, rounded to 50
    });

    it('should return undefined for unsupported currency', () => {
      const result = convertToEUR(1000, 'USD');
      expect(result).toBeUndefined();
    });
  });

  describe('getExchangeRate', () => {
    it('should return correct rates', () => {
      expect(getExchangeRate('EUR')).toBe(1.0);
      expect(getExchangeRate('ZAR')).toBe(0.05);
    });

    it('should return undefined for unsupported currency', () => {
      expect(getExchangeRate('USD')).toBeUndefined();
    });
  });

  describe('formatCurrency', () => {
    it('should format EUR with 2 decimal places', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
      expect(formatCurrency(1000.5, 'EUR')).toBe('€1,000.50');
    });

    it('should format other currencies as integers', () => {
      expect(formatCurrency(1000, 'ZAR')).toBe('ZAR\u00A01,000');
      expect(formatCurrency(1000.5, 'ZAR')).toBe('ZAR\u00A01,001');
    });
  });

  describe('formatEURAmount', () => {
    it('should format EUR amounts correctly', () => {
      expect(formatEURAmount(1000)).toBe('€1,000.00');
      expect(formatEURAmount(50)).toBe('€50.00');
    });
  });

  describe('getConversionSummary', () => {
    it('should return conversion summary for EUR', () => {
      const summary = getConversionSummary(1000, 'EUR');
      expect(summary).toBe('€1,000.00 = €1,000.00');
    });

    it('should return conversion summary for ZAR', () => {
      const summary = getConversionSummary(1000, 'ZAR');
      expect(summary).toBe('ZAR\u00A01,000 = €50.00');
    });

    it('should return undefined for unsupported currency', () => {
      const summary = getConversionSummary(1000, 'USD');
      expect(summary).toBeUndefined();
    });
  });

  describe('isCurrencySupported', () => {
    it('should return true for supported currencies', () => {
      expect(isCurrencySupported('EUR')).toBe(true);
      expect(isCurrencySupported('ZAR')).toBe(true);
    });

    it('should return false for unsupported currencies', () => {
      expect(isCurrencySupported('USD')).toBe(false);
      expect(isCurrencySupported('GBP')).toBe(false);
    });
  });

  describe('getSupportedCurrencies', () => {
    it('should return array of supported currencies', () => {
      const currencies = getSupportedCurrencies();
      expect(currencies).toContain('EUR');
      expect(currencies).toContain('ZAR');
      expect(currencies).toHaveLength(2);
    });
  });

  describe('edge cases', () => {
    it('should handle zero amounts', () => {
      const result = convertToEUR(0, 'ZAR');
      expect(result?.eurAmount).toBe(0);
    });

    it('should handle large amounts', () => {
      const result = convertToEUR(1000000, 'ZAR');
      expect(result?.eurAmount).toBe(50000); // 1,000,000 * 0.05 = 50,000
    });

    it('should round correctly for various ZAR amounts', () => {
      expect(convertToEUR(19, 'ZAR')?.eurAmount).toBe(1); // 19 * 0.05 = 0.95, rounded to 1
      expect(convertToEUR(21, 'ZAR')?.eurAmount).toBe(1); // 21 * 0.05 = 1.05, rounded to 1
      expect(convertToEUR(20, 'ZAR')?.eurAmount).toBe(1); // 20 * 0.05 = 1.00, rounded to 1
    });
  });
});
