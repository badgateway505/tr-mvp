import { describe, it, expect } from 'vitest';
import {
  getThresholdBucket,
  isAmountAboveThreshold,
  getCountryThreshold,
  getThresholdBuckets,
} from '../thresholdUtils';
import { extractRequirements, getAllRequirements } from '../requirementExtractor';
import { getCountryRule } from '../loadRequirements';

describe('Task 10.1: Threshold Edge Cases - Manual QA Scenarios', () => {
  describe('DEU (Germany) - Threshold 0 - Zero and Above Threshold', () => {
    const countryCode = 'DEU';
    const threshold = 0;

    it('should have threshold of 0', () => {
      expect(getCountryThreshold(countryCode)).toBe(threshold);
    });

    it('should be above threshold for zero and positive amounts', () => {
      // Test various amounts including edge cases
      const testAmounts = [0, 1, 100, 1000, 10000, 100000];
      
      testAmounts.forEach(amount => {
        const bucket = getThresholdBucket(countryCode, amount);
        const isAbove = isAmountAboveThreshold(countryCode, amount);
        
        expect(bucket).toBe('above_threshold');
        expect(isAbove).toBe(true);
      });
    });

    it('should be below threshold for negative amounts', () => {
      // Test negative amounts (edge case)
      const testAmounts = [-1000, -100, -1];
      
      testAmounts.forEach(amount => {
        const bucket = getThresholdBucket(countryCode, amount);
        const isAbove = isAmountAboveThreshold(countryCode, amount);
        
        expect(bucket).toBe('below_threshold');
        expect(isAbove).toBe(false);
      });
    });

    it('should always extract above_threshold requirements for zero and positive amounts', () => {
      const testAmounts = [0, 1, 100, 1000, 10000];
      
      testAmounts.forEach(amount => {
        const requirements = extractRequirements(countryCode, amount);
        expect(requirements).toBeDefined();
        
        // DEU above_threshold should always have these fields
        expect(requirements?.fields).toContain('full_name');
        expect(requirements?.fields).toContain('date_of_birth');
        expect(requirements?.fields).toContain('id_document_number');
        expect(requirements?.fields).toContain('residential_address');
        
        // DEU above_threshold should always have these flags
        expect(requirements?.kyc_required).toBe(true);
        expect(requirements?.aml_required).toBe(true);
        expect(requirements?.wallet_attribution).toBe(false);
      });
    });

    it('should extract below_threshold requirements for negative amounts', () => {
      const testAmounts = [-1000, -100, -1];
      
      testAmounts.forEach(amount => {
        const requirements = extractRequirements(countryCode, amount);
        expect(requirements).toBeDefined();
        
        // DEU below_threshold should have these fields
        expect(requirements?.fields).toContain('full_name');
        expect(requirements?.fields).toContain('date_of_birth');
        
        // DEU below_threshold should have these flags
        expect(requirements?.kyc_required).toBe(false);
        expect(requirements?.aml_required).toBe(false);
        expect(requirements?.wallet_attribution).toBe(false);
      });
    });

    it('should provide consistent threshold buckets for all amounts', () => {
      const testAmounts = [-1000, -1, 0, 1, 100, 1000, 10000];
      
      testAmounts.forEach(amount => {
        const buckets = getThresholdBuckets(countryCode);
        expect(buckets).toBeDefined();
        expect(buckets?.threshold).toBe(threshold);
        
        // Both buckets should be available
        expect(buckets?.below_threshold).toBeDefined();
        expect(buckets?.above_threshold).toBeDefined();
      });
    });
  });

  describe('ZAF (South Africa) - Threshold 5000 - Boundary Testing', () => {
    const countryCode = 'ZAF';
    const threshold = 5000;

    it('should have threshold of 5000', () => {
      expect(getCountryThreshold(countryCode)).toBe(threshold);
    });

    it('should handle exact threshold boundary correctly', () => {
      // Test the exact boundary
      expect(getThresholdBucket(countryCode, 4999)).toBe('below_threshold');
      expect(getThresholdBucket(countryCode, 5000)).toBe('above_threshold');
      expect(getThresholdBucket(countryCode, 5001)).toBe('above_threshold');
      
      expect(isAmountAboveThreshold(countryCode, 4999)).toBe(false);
      expect(isAmountAboveThreshold(countryCode, 5000)).toBe(true);
      expect(isAmountAboveThreshold(countryCode, 5001)).toBe(true);
    });

    it('should handle amounts around the boundary', () => {
      // Test amounts just below and above the boundary
      const belowBoundary = [4990, 4995, 4999];
      const atBoundary = [5000];
      const aboveBoundary = [5001, 5005, 5010];
      
      belowBoundary.forEach(amount => {
        expect(getThresholdBucket(countryCode, amount)).toBe('below_threshold');
        expect(isAmountAboveThreshold(countryCode, amount)).toBe(false);
      });
      
      atBoundary.forEach(amount => {
        expect(getThresholdBucket(countryCode, amount)).toBe('above_threshold');
        expect(isAmountAboveThreshold(countryCode, amount)).toBe(true);
      });
      
      aboveBoundary.forEach(amount => {
        expect(getThresholdBucket(countryCode, amount)).toBe('above_threshold');
        expect(isAmountAboveThreshold(countryCode, amount)).toBe(true);
      });
    });

    it('should extract correct requirements below threshold', () => {
      const requirements = extractRequirements(countryCode, 4999);
      expect(requirements).toBeDefined();
      
      // ZAF below_threshold should have simple fields
      expect(requirements?.fields).toEqual(['full_name']);
      expect(requirements?.groups).toBeUndefined();
      
      // ZAF below_threshold should have these flags
      expect(requirements?.kyc_required).toBe(false);
      expect(requirements?.aml_required).toBe(false);
      expect(requirements?.wallet_attribution).toBe(false);
    });

    it('should extract correct requirements above threshold', () => {
      const requirements = extractRequirements(countryCode, 5000);
      expect(requirements).toBeDefined();
      
      // ZAF above_threshold should have requirement groups
      expect(requirements?.fields).toEqual([]);
      expect(requirements?.groups).toBeDefined();
      expect(requirements?.groups).toHaveLength(2);
      
      // First group: AND logic
      expect(requirements?.groups?.[0].logic).toBe('AND');
      expect(requirements?.groups?.[0].fields).toEqual(['full_name', 'date_of_birth + birthplace']);
      
      // Second group: OR logic
      expect(requirements?.groups?.[1].logic).toBe('OR');
      expect(requirements?.groups?.[1].fields).toEqual(['id_document_number', 'passport_number']);
      
      // ZAF above_threshold should have these flags
      expect(requirements?.kyc_required).toBe(true);
      expect(requirements?.aml_required).toBe(true);
      expect(requirements?.wallet_attribution).toBe(true);
    });

    it('should provide consistent threshold buckets for all amounts', () => {
      const testAmounts = [4999, 5000, 5001];
      
      testAmounts.forEach(amount => {
        const buckets = getThresholdBuckets(countryCode);
        expect(buckets).toBeDefined();
        expect(buckets?.threshold).toBe(threshold);
        
        // Both buckets should be available
        expect(buckets?.below_threshold).toBeDefined();
        expect(buckets?.above_threshold).toBeDefined();
      });
    });
  });

  describe('Independent Evaluation Per Side - Critical Business Logic', () => {
    it('should evaluate DEU and ZAF independently regardless of other side', () => {
      // Test that each country's threshold evaluation is completely independent
      const testScenarios = [
        { sumsub: 'DEU', counterparty: 'ZAF', amount: 1000 },
        { sumsub: 'ZAF', counterparty: 'DEU', amount: 1000 },
        { sumsub: 'DEU', counterparty: 'ZAF', amount: 6000 },
        { sumsub: 'ZAF', counterparty: 'DEU', amount: 6000 },
      ];
      
      testScenarios.forEach(scenario => {
        const sumsubBucket = getThresholdBucket(scenario.sumsub, scenario.amount);
        const counterpartyBucket = getThresholdBucket(scenario.counterparty, scenario.amount);
        
        // DEU should always be above_threshold for non-negative amounts
        if (scenario.sumsub === 'DEU') {
          expect(sumsubBucket).toBe('above_threshold');
        }
        if (scenario.counterparty === 'DEU') {
          expect(counterpartyBucket).toBe('above_threshold');
        }
        
        // ZAF should be below_threshold for 1000, above_threshold for 6000
        if (scenario.sumsub === 'ZAF') {
          if (scenario.amount < 5000) {
            expect(sumsubBucket).toBe('below_threshold');
          } else {
            expect(sumsubBucket).toBe('above_threshold');
          }
        }
        if (scenario.counterparty === 'ZAF') {
          if (scenario.amount < 5000) {
            expect(counterpartyBucket).toBe('below_threshold');
          } else {
            expect(counterpartyBucket).toBe('above_threshold');
          }
        }
      });
    });

    it('should maintain independent requirement extraction per side', () => {
      const amount = 1000;
      
      // DEU side (above threshold for positive amounts)
      const deuRequirements = extractRequirements('DEU', amount);
      expect(deuRequirements).toBeDefined();
      expect(deuRequirements?.fields).toContain('id_document_number');
      expect(deuRequirements?.kyc_required).toBe(true);
      
      // ZAF side (below threshold)
      const zafRequirements = extractRequirements('ZAF', amount);
      expect(zafRequirements).toBeDefined();
      expect(zafRequirements?.fields).not.toContain('id_document_number');
      expect(zafRequirements?.kyc_required).toBe(false);
      
      // Requirements should be completely independent
      expect(deuRequirements?.fields).not.toEqual(zafRequirements?.fields);
      expect(deuRequirements?.kyc_required).not.toBe(zafRequirements?.kyc_required);
    });

    it('should handle currency conversion independently per side', () => {
      const amount = 1000;
      
      // DEU uses EUR
      const deuRule = getCountryRule('DEU');
      expect(deuRule?.currency).toBe('EUR');
      expect(deuRule?.threshold).toBe(0);
      
      // ZAF uses ZAR
      const zafRule = getCountryRule('ZAF');
      expect(zafRule?.currency).toBe('ZAR');
      expect(zafRule?.threshold).toBe(5000);
      
      // Threshold evaluation should be in local currency, not converted
      expect(getThresholdBucket('DEU', amount)).toBe('above_threshold');
      expect(getThresholdBucket('ZAF', amount)).toBe('below_threshold');
    });
  });

  describe('Edge Case Amounts - Comprehensive Boundary Testing', () => {
    it('should handle negative amounts correctly', () => {
      // DEU should be below threshold with negative amounts
      expect(getThresholdBucket('DEU', -1)).toBe('below_threshold');
      expect(getThresholdBucket('DEU', -1000)).toBe('below_threshold');
      
      // ZAF should be below threshold with negative amounts
      expect(getThresholdBucket('ZAF', -1)).toBe('below_threshold');
      expect(getThresholdBucket('ZAF', -1000)).toBe('below_threshold');
    });

    it('should handle very large amounts correctly', () => {
      const largeAmounts = [1000000, 999999999, Number.MAX_SAFE_INTEGER];
      
      largeAmounts.forEach(amount => {
        // DEU should always be above threshold for positive amounts
        expect(getThresholdBucket('DEU', amount)).toBe('above_threshold');
        expect(isAmountAboveThreshold('DEU', amount)).toBe(true);
        
        // ZAF should always be above threshold with large amounts
        expect(getThresholdBucket('ZAF', amount)).toBe('above_threshold');
        expect(isAmountAboveThreshold('ZAF', amount)).toBe(true);
      });
    });

    it('should handle fractional amounts correctly (if supported)', () => {
      // Test with amounts that might have decimal precision
      const fractionalAmounts = [4999.99, 5000.01, 5000.5];
      
      fractionalAmounts.forEach(amount => {
        // DEU should always be above threshold for non-negative amounts
        expect(getThresholdBucket('DEU', amount)).toBe('above_threshold');
        
        // ZAF should respect the 5000 boundary
        if (amount < 5000) {
          expect(getThresholdBucket('ZAF', amount)).toBe('below_threshold');
        } else {
          expect(getThresholdBucket('ZAF', amount)).toBe('above_threshold');
        }
      });
    });
  });

  describe('Data Consistency and Validation', () => {
    it('should maintain data consistency across all threshold functions', () => {
      const testAmounts = [0, 1000, 4999, 5000, 5001, 10000];
      
      testAmounts.forEach(amount => {
        // All functions should return consistent results
        const bucket = getThresholdBucket('DEU', amount);
        const isAbove = isAmountAboveThreshold('DEU', amount);
        const requirements = extractRequirements('DEU', amount);
        
        expect(bucket).toBe('above_threshold');
        expect(isAbove).toBe(true);
        expect(requirements).toBeDefined();
        expect(requirements?.kyc_required).toBe(true);
      });
    });

    it('should validate that threshold values are correctly defined in requirements', () => {
      const deuRule = getCountryRule('DEU');
      const zafRule = getCountryRule('ZAF');
      
      expect(deuRule?.threshold).toBe(0);
      expect(zafRule?.threshold).toBe(5000);
      
      // Verify that the threshold values match what's used in the logic
      expect(getCountryThreshold('DEU')).toBe(deuRule?.threshold);
      expect(getCountryThreshold('ZAF')).toBe(zafRule?.threshold);
    });
  });

  describe('Business Logic Validation - Real-World Scenarios', () => {
    it('should handle typical business amounts correctly', () => {
      // Test realistic business transaction amounts
      const businessAmounts = [
        { amount: 0, description: 'Zero amount' },
        { amount: 100, description: 'Small transaction' },
        { amount: 1000, description: 'Medium transaction' },
        { amount: 4999, description: 'Just below ZAF threshold' },
        { amount: 5000, description: 'Exactly at ZAF threshold' },
        { amount: 5001, description: 'Just above ZAF threshold' },
        { amount: 10000, description: 'Large transaction' },
      ];
      
      businessAmounts.forEach(({ amount, description }) => {
        // DEU should be above threshold for all non-negative amounts
        if (amount >= 0) {
          expect(getThresholdBucket('DEU', amount)).toBe('above_threshold');
        }
        
        // ZAF should respect the 5000 boundary
        if (amount < 5000) {
          expect(getThresholdBucket('ZAF', amount)).toBe('below_threshold');
        } else {
          expect(getThresholdBucket('ZAF', amount)).toBe('above_threshold');
        }
      });
    });

    it('should maintain independent evaluation in multi-country scenarios', () => {
      // Test complex scenarios with multiple countries and amounts
      const scenarios = [
        {
          sumsub: 'DEU',
          counterparty: 'ZAF',
          amount: 3000,
          expected: { sumsub: 'above_threshold', counterparty: 'below_threshold' }
        },
        {
          sumsub: 'ZAF',
          counterparty: 'DEU',
          amount: 7000,
          expected: { sumsub: 'above_threshold', counterparty: 'above_threshold' }
        },
        {
          sumsub: 'DEU',
          counterparty: 'ZAF',
          amount: 0,
          expected: { sumsub: 'above_threshold', counterparty: 'below_threshold' }
        }
      ];
      
      scenarios.forEach(scenario => {
        const sumsubBucket = getThresholdBucket(scenario.sumsub, scenario.amount);
        const counterpartyBucket = getThresholdBucket(scenario.counterparty, scenario.amount);
        
        expect(sumsubBucket).toBe(scenario.expected.sumsub);
        expect(counterpartyBucket).toBe(scenario.expected.counterparty);
        
        // Verify that each side's requirements are extracted independently
        const sumsubReqs = extractRequirements(scenario.sumsub, scenario.amount);
        const counterpartyReqs = extractRequirements(scenario.counterparty, scenario.amount);
        
        expect(sumsubReqs).toBeDefined();
        expect(counterpartyReqs).toBeDefined();
        
        // Requirements should be different between sides
        expect(sumsubReqs?.fields).not.toEqual(counterpartyReqs?.fields);
      });
    });
  });
});
