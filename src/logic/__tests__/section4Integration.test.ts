import { describe, it, expect } from 'vitest';
import {
  getDirectionLabels,
  getSumsubLabel,
  getCounterpartyLabel,
} from '../directionUtils';
import { getThresholdBucket } from '../thresholdUtils';
import { extractRequirements } from '../requirementExtractor';
import { normalizeFields, fieldsMatch } from '../fieldNormalization';
import { convertToEUR, getConversionSummary } from '../currencyConversion';
import { getCountryRule } from '../loadRequirements';

describe('Section 4 Integration Tests', () => {
  describe('Complete workflow: DEU OUT direction, amount 1000', () => {
    const direction = 'OUT';
    const sumsubCountry = 'DEU';
    const counterpartyCountry = 'ZAF';
    const amount = 1000;

    it('should handle direction logic correctly', () => {
      const labels = getDirectionLabels(direction);
      expect(labels.sender).toBe('Sumsub');
      expect(labels.receiver).toBe('Counterparty');
      expect(getSumsubLabel(direction)).toBe('Sender');
      expect(getCounterpartyLabel(direction)).toBe('Receiver');
    });

    it('should determine correct threshold buckets', () => {
      const sumsubBucket = getThresholdBucket(sumsubCountry, amount);
      const counterpartyBucket = getThresholdBucket(
        counterpartyCountry,
        amount
      );

      expect(sumsubBucket).toBe('above_threshold'); // DEU threshold = 0
      expect(counterpartyBucket).toBe('below_threshold'); // ZAF threshold = 5000
    });

    it('should extract requirements correctly', () => {
      const sumsubReqs = extractRequirements(sumsubCountry, amount);
      const counterpartyReqs = extractRequirements(counterpartyCountry, amount);

      expect(sumsubReqs).toBeDefined();
      expect(counterpartyReqs).toBeDefined();
      expect(sumsubReqs?.fields).toContain('full_name');
      expect(sumsubReqs?.fields).toContain('date_of_birth');
      expect(sumsubReqs?.fields).toContain('id_document_number');
      expect(sumsubReqs?.fields).toContain('residential_address');
      expect(sumsubReqs?.kyc_required).toBe(true);
      expect(sumsubReqs?.aml_required).toBe(true);

      expect(counterpartyReqs?.fields).toContain('full_name');
      expect(counterpartyReqs?.kyc_required).toBe(false);
      expect(counterpartyReqs?.aml_required).toBe(false);
    });

    it('should normalize fields correctly', () => {
      const sumsubReqs = extractRequirements(sumsubCountry, amount);
      const counterpartyReqs = extractRequirements(counterpartyCountry, amount);

      if (sumsubReqs && counterpartyReqs) {
        const sumsubNormalized = normalizeFields(sumsubReqs.fields);
        const counterpartyNormalized = normalizeFields(counterpartyReqs.fields);

        expect(sumsubNormalized).toHaveLength(4);
        expect(counterpartyNormalized).toHaveLength(1);

        // Check that full_name is normalized the same way
        const sumsubFullName = sumsubNormalized.find(
          (f) => f.normalized === 'full_name'
        );
        const counterpartyFullName = counterpartyNormalized.find(
          (f) => f.normalized === 'full_name'
        );

        expect(sumsubFullName).toBeDefined();
        expect(counterpartyFullName).toBeDefined();
        expect(sumsubFullName?.normalized).toBe(
          counterpartyFullName?.normalized
        );
      }
    });

    it('should handle currency conversion correctly', () => {
      const countryRule = getCountryRule(sumsubCountry);
      expect(countryRule).toBeDefined();
      expect(countryRule?.currency).toBe('EUR');

      const conversion = convertToEUR(amount, countryRule!.currency);
      expect(conversion).toBeDefined();
      expect(conversion?.eurAmount).toBe(1000);
      expect(conversion?.exchangeRate).toBe(1.0);

      const summary = getConversionSummary(amount, countryRule!.currency);
      expect(summary).toBe('€1,000.00 = €1,000.00');
    });
  });

  describe('Complete workflow: ZAF IN direction, amount 6000', () => {
    const direction = 'IN';
    const sumsubCountry = 'ZAF';
    const counterpartyCountry = 'DEU';
    const amount = 6000;

    it('should handle direction logic correctly', () => {
      const labels = getDirectionLabels(direction);
      expect(labels.sender).toBe('Counterparty');
      expect(labels.receiver).toBe('Sumsub');
      expect(getSumsubLabel(direction)).toBe('Receiver');
      expect(getCounterpartyLabel(direction)).toBe('Sender');
    });

    it('should determine correct threshold buckets', () => {
      const sumsubBucket = getThresholdBucket(sumsubCountry, amount);
      const counterpartyBucket = getThresholdBucket(
        counterpartyCountry,
        amount
      );

      expect(sumsubBucket).toBe('above_threshold'); // ZAF threshold = 5000
      expect(counterpartyBucket).toBe('above_threshold'); // DEU threshold = 0
    });

    it('should extract requirements with groups correctly', () => {
      const sumsubReqs = extractRequirements(sumsubCountry, amount);
      const counterpartyReqs = extractRequirements(counterpartyCountry, amount);

      expect(sumsubReqs).toBeDefined();
      expect(counterpartyReqs).toBeDefined();

      // ZAF above threshold uses requirement groups
      expect(sumsubReqs?.groups).toBeDefined();
      expect(sumsubReqs?.groups).toHaveLength(2);
      expect(sumsubReqs?.kyc_required).toBe(true);
      expect(sumsubReqs?.aml_required).toBe(true);
      expect(sumsubReqs?.wallet_attribution).toBe(true);

      // DEU above threshold uses required fields
      expect(counterpartyReqs?.fields).toHaveLength(4);
      expect(counterpartyReqs?.kyc_required).toBe(true);
      expect(counterpartyReqs?.aml_required).toBe(true);
    });

    it('should handle combo fields correctly', () => {
      const sumsubReqs = extractRequirements(sumsubCountry, amount);

      if (sumsubReqs?.groups) {
        const firstGroup = sumsubReqs.groups[0];
        expect(firstGroup.logic).toBe('AND');
        expect(firstGroup.fields).toContain('date_of_birth + birthplace');

        // Test combo field matching
        const comboField = 'date_of_birth + birthplace';
        const individualField = 'date_of_birth';
        expect(fieldsMatch(comboField, individualField)).toBe(true);
        expect(fieldsMatch(individualField, comboField)).toBe(true);
      }
    });

    it('should handle currency conversion correctly', () => {
      const countryRule = getCountryRule(sumsubCountry);
      expect(countryRule).toBeDefined();
      expect(countryRule?.currency).toBe('ZAR');

      const conversion = convertToEUR(amount, countryRule!.currency);
      expect(conversion).toBeDefined();
      expect(conversion?.eurAmount).toBe(300); // 6000 * 0.05 = 300
      expect(conversion?.exchangeRate).toBe(0.05);

      const summary = getConversionSummary(amount, countryRule!.currency);
      expect(summary).toBe('ZAR\u00A06,000 = €300.00');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle invalid countries gracefully', () => {
      expect(getThresholdBucket('INVALID' as string, 1000)).toBeUndefined();
      expect(extractRequirements('INVALID' as string, 1000)).toBeUndefined();
      expect(convertToEUR(1000, 'INVALID')).toBeUndefined();
    });

    it('should handle zero amounts correctly', () => {
      expect(getThresholdBucket('DEU', 0)).toBe('above_threshold'); // DEU threshold = 0
      expect(getThresholdBucket('ZAF', 0)).toBe('below_threshold'); // ZAF threshold = 5000
    });

    it('should handle threshold boundary amounts correctly', () => {
      expect(getThresholdBucket('ZAF', 4999)).toBe('below_threshold');
      expect(getThresholdBucket('ZAF', 5000)).toBe('above_threshold');
      expect(getThresholdBucket('ZAF', 5001)).toBe('above_threshold');
    });
  });
});
