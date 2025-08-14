import { describe, it, expect } from 'vitest';
import {
  getDirectionLabels,
  getSumsubLabel,
  getCounterpartyLabel,
} from '../directionUtils';
import { getThresholdBucket } from '../thresholdUtils';
import { extractRequirements } from '../requirementExtractor';
import { getCountryRule } from '../loadRequirements';
import { convertToEUR, getConversionSummary } from '../currencyConversion';

describe('Task 10.2: Direction Cases (IN vs OUT) - Manual QA Scenarios', () => {
  describe('Direction Labeling Logic', () => {
    it('should correctly label OUT direction', () => {
      const direction = 'OUT';

      const labels = getDirectionLabels(direction);
      expect(labels.sender).toBe('Sumsub');
      expect(labels.receiver).toBe('Counterparty');

      expect(getSumsubLabel(direction)).toBe('Sender');
      expect(getCounterpartyLabel(direction)).toBe('Receiver');
    });

    it('should correctly label IN direction', () => {
      const direction = 'IN';

      const labels = getDirectionLabels(direction);
      expect(labels.sender).toBe('Counterparty');
      expect(labels.receiver).toBe('Sumsub');

      expect(getSumsubLabel(direction)).toBe('Receiver');
      expect(getCounterpartyLabel(direction)).toBe('Sender');
    });

    it('should maintain consistent labeling across all functions', () => {
      const directions: Array<'IN' | 'OUT'> = ['IN', 'OUT'];

      directions.forEach((direction) => {
        const labels = getDirectionLabels(direction);
        const sumsubLabel = getSumsubLabel(direction);
        const counterpartyLabel = getCounterpartyLabel(direction);

        // Verify consistency between getDirectionLabels and individual label functions
        if (direction === 'OUT') {
          expect(labels.sender).toBe('Sumsub');
          expect(labels.receiver).toBe('Counterparty');
          expect(sumsubLabel).toBe('Sender');
          expect(counterpartyLabel).toBe('Receiver');
        } else {
          expect(labels.sender).toBe('Counterparty');
          expect(labels.receiver).toBe('Sumsub');
          expect(sumsubLabel).toBe('Receiver');
          expect(counterpartyLabel).toBe('Sender');
        }
      });
    });
  });

  describe('Direction Independence from Threshold Evaluation', () => {
    it('should evaluate DEU threshold independently of direction', () => {
      const directions: Array<'IN' | 'OUT'> = ['IN', 'OUT'];
      const testAmounts = [0, 100, 1000, 10000];

      directions.forEach(() => {
        testAmounts.forEach((amount) => {
          // DEU threshold evaluation should be identical regardless of direction
          const bucket = getThresholdBucket('DEU', amount);
          const requirements = extractRequirements('DEU', amount);

          expect(bucket).toBe('above_threshold');
          expect(requirements).toBeDefined();
          expect(requirements?.kyc_required).toBe(true);
          expect(requirements?.aml_required).toBe(true);
        });
      });
    });

    it('should evaluate ZAF threshold independently of direction', () => {
      const directions: Array<'IN' | 'OUT'> = ['IN', 'OUT'];
      const belowThresholdAmounts = [100, 1000, 4999];
      const aboveThresholdAmounts = [5000, 6000, 10000];

      directions.forEach(() => {
        // Below threshold amounts
        belowThresholdAmounts.forEach((amount) => {
          const bucket = getThresholdBucket('ZAF', amount);
          const requirements = extractRequirements('ZAF', amount);

          expect(bucket).toBe('below_threshold');
          expect(requirements?.kyc_required).toBe(false);
          expect(requirements?.aml_required).toBe(false);
        });

        // Above threshold amounts
        aboveThresholdAmounts.forEach((amount) => {
          const bucket = getThresholdBucket('ZAF', amount);
          const requirements = extractRequirements('ZAF', amount);

          expect(bucket).toBe('above_threshold');
          expect(requirements?.kyc_required).toBe(true);
          expect(requirements?.aml_required).toBe(true);
        });
      });
    });

    it('should maintain independent threshold evaluation in multi-country scenarios', () => {
      const directions: Array<'IN' | 'OUT'> = ['IN', 'OUT'];
      const scenarios = [
        { sumsub: 'DEU', counterparty: 'ZAF', amount: 1000 },
        { sumsub: 'ZAF', counterparty: 'DEU', amount: 6000 },
      ];

      directions.forEach(() => {
        scenarios.forEach((scenario) => {
          // Threshold evaluation should be identical regardless of direction
          const sumsubBucket = getThresholdBucket(
            scenario.sumsub,
            scenario.amount
          );
          const counterpartyBucket = getThresholdBucket(
            scenario.counterparty,
            scenario.amount
          );

          // Results should be the same for both directions
          if (scenario.sumsub === 'DEU') {
            expect(sumsubBucket).toBe('above_threshold');
          } else if (scenario.sumsub === 'ZAF') {
            if (scenario.amount < 5000) {
              expect(sumsubBucket).toBe('below_threshold');
            } else {
              expect(sumsubBucket).toBe('above_threshold');
            }
          }

          if (scenario.counterparty === 'DEU') {
            expect(counterpartyBucket).toBe('above_threshold');
          } else if (scenario.counterparty === 'ZAF') {
            if (scenario.amount < 5000) {
              expect(counterpartyBucket).toBe('below_threshold');
            } else {
              expect(counterpartyBucket).toBe('above_threshold');
            }
          }
        });
      });
    });
  });

  describe('Direction Independence from Requirements Extraction', () => {
    it('should extract identical requirements for DEU regardless of direction', () => {
      const directions: Array<'IN' | 'OUT'> = ['IN', 'OUT'];
      const testAmounts = [0, 100, 1000, 10000];

      directions.forEach(() => {
        testAmounts.forEach((amount) => {
          const requirements = extractRequirements('DEU', amount);

          // Requirements should be identical regardless of direction
          expect(requirements?.fields).toContain('full_name');
          expect(requirements?.fields).toContain('date_of_birth');
          expect(requirements?.fields).toContain('id_document_number');
          expect(requirements?.fields).toContain('residential_address');
          expect(requirements?.kyc_required).toBe(true);
          expect(requirements?.aml_required).toBe(true);
          expect(requirements?.wallet_attribution).toBe(false);
        });
      });
    });

    it('should extract identical requirements for ZAF regardless of direction', () => {
      const directions: Array<'IN' | 'OUT'> = ['IN', 'OUT'];
      const belowThresholdAmount = 1000;
      const aboveThresholdAmount = 6000;

      directions.forEach(() => {
        // Below threshold requirements
        const belowRequirements = extractRequirements(
          'ZAF',
          belowThresholdAmount
        );
        expect(belowRequirements?.fields).toEqual(['full_name']);
        expect(belowRequirements?.kyc_required).toBe(false);
        expect(belowRequirements?.aml_required).toBe(false);

        // Above threshold requirements
        const aboveRequirements = extractRequirements(
          'ZAF',
          aboveThresholdAmount
        );
        expect(aboveRequirements?.groups).toBeDefined();
        expect(aboveRequirements?.kyc_required).toBe(true);
        expect(aboveRequirements?.aml_required).toBe(true);
        expect(aboveRequirements?.wallet_attribution).toBe(true);
      });
    });

    it('should maintain field matching independence from direction', () => {
      const directions: Array<'IN' | 'OUT'> = ['IN', 'OUT'];
      const amount = 1000;

      directions.forEach(() => {
        // Extract requirements for both sides
        const deuRequirements = extractRequirements('DEU', amount);
        const zafRequirements = extractRequirements('ZAF', amount);

        expect(deuRequirements).toBeDefined();
        expect(zafRequirements).toBeDefined();

        // Field matching should be identical regardless of direction
        expect(deuRequirements?.fields).toContain('full_name');
        expect(zafRequirements?.fields).toContain('full_name');

        // DEU should have more fields than ZAF at this amount
        expect(deuRequirements?.fields.length).toBeGreaterThan(
          zafRequirements?.fields.length || 0
        );
      });
    });
  });

  describe('Direction Independence from Currency Conversion', () => {
    it('should convert currencies identically regardless of direction', () => {
      const directions: Array<'IN' | 'OUT'> = ['IN', 'OUT'];
      const testAmounts = [100, 1000, 5000];

      directions.forEach(() => {
        testAmounts.forEach((amount) => {
          // DEU (EUR) conversion
          const deuConversion = convertToEUR(amount, 'EUR');
          expect(deuConversion?.eurAmount).toBe(amount);
          expect(deuConversion?.exchangeRate).toBe(1.0);

          // ZAF (ZAR) conversion
          const zafConversion = convertToEUR(amount, 'ZAR');
          expect(zafConversion?.eurAmount).toBe(Math.round(amount * 0.05));
          expect(zafConversion?.exchangeRate).toBe(0.05);
        });
      });
    });

    it('should generate identical conversion summaries regardless of direction', () => {
      const directions: Array<'IN' | 'OUT'> = ['IN', 'OUT'];
      const testAmounts = [100, 1000, 5000];

      directions.forEach(() => {
        testAmounts.forEach((amount) => {
          // EUR conversion summary
          const eurSummary = getConversionSummary(amount, 'EUR');
          expect(eurSummary).toBe(
            `€${amount.toLocaleString()}.00 = €${amount.toLocaleString()}.00`
          );

          // ZAR conversion summary
          const zarSummary = getConversionSummary(amount, 'ZAR');
          const expectedEurAmount = Math.round(amount * 0.05);
          expect(zarSummary).toBe(
            `ZAR\u00A0${amount.toLocaleString()} = €${expectedEurAmount.toLocaleString()}.00`
          );
        });
      });
    });
  });

  describe('Complete Workflow Validation - Direction Independence', () => {
    it('should maintain complete workflow integrity for OUT direction', () => {
      const direction = 'OUT';
      const sumsubCountry = 'DEU';
      const counterpartyCountry = 'ZAF';
      const amount = 1000;

      // Direction labeling
      const labels = getDirectionLabels(direction);
      expect(labels.sender).toBe('Sumsub');
      expect(labels.receiver).toBe('Counterparty');

      // Threshold evaluation (should be independent of direction)
      const sumsubBucket = getThresholdBucket(sumsubCountry, amount);
      const counterpartyBucket = getThresholdBucket(
        counterpartyCountry,
        amount
      );
      expect(sumsubBucket).toBe('above_threshold');
      expect(counterpartyBucket).toBe('below_threshold');

      // Requirements extraction (should be independent of direction)
      const sumsubReqs = extractRequirements(sumsubCountry, amount);
      const counterpartyReqs = extractRequirements(counterpartyCountry, amount);
      expect(sumsubReqs?.kyc_required).toBe(true);
      expect(counterpartyReqs?.kyc_required).toBe(false);

      // Currency conversion (should be independent of direction)
      const sumsubRule = getCountryRule(sumsubCountry);
      const conversion = convertToEUR(amount, sumsubRule!.currency);
      expect(conversion?.eurAmount).toBe(1000);
    });

    it('should maintain complete workflow integrity for IN direction', () => {
      const direction = 'IN';
      const sumsubCountry = 'ZAF';
      const counterpartyCountry = 'DEU';
      const amount = 6000;

      // Direction labeling
      const labels = getDirectionLabels(direction);
      expect(labels.sender).toBe('Counterparty');
      expect(labels.receiver).toBe('Sumsub');

      // Threshold evaluation (should be independent of direction)
      const sumsubBucket = getThresholdBucket(sumsubCountry, amount);
      const counterpartyBucket = getThresholdBucket(
        counterpartyCountry,
        amount
      );
      expect(sumsubBucket).toBe('above_threshold');
      expect(counterpartyBucket).toBe('above_threshold');

      // Requirements extraction (should be independent of direction)
      const sumsubReqs = extractRequirements(sumsubCountry, amount);
      const counterpartyReqs = extractRequirements(counterpartyCountry, amount);
      expect(sumsubReqs?.groups).toBeDefined();
      expect(counterpartyReqs?.fields).toContain('id_document_number');

      // Currency conversion (should be independent of direction)
      const sumsubRule = getCountryRule(sumsubCountry);
      const conversion = convertToEUR(amount, sumsubRule!.currency);
      expect(conversion?.eurAmount).toBe(300); // 6000 * 0.05 = 300
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle direction changes without affecting other logic', () => {
      const testAmount = 1000;
      const countries = ['DEU', 'ZAF'];

      // Test both directions
      ['IN', 'OUT'].forEach(() => {
        countries.forEach((country) => {
          // All core logic should remain identical
          const bucket = getThresholdBucket(country, testAmount);
          const requirements = extractRequirements(country, testAmount);

          expect(bucket).toBeDefined();
          expect(requirements).toBeDefined();

          // Currency conversion should be identical
          const countryRule = getCountryRule(country);
          if (countryRule) {
            const conversion = convertToEUR(testAmount, countryRule.currency);
            expect(conversion).toBeDefined();
          }
        });
      });
    });

    it('should maintain data consistency across direction changes', () => {
      const testAmount = 5000;
      const directions: Array<'IN' | 'OUT'> = ['IN', 'OUT'];

      directions.forEach(() => {
        // DEU should always be above threshold
        const deuBucket = getThresholdBucket('DEU', testAmount);
        const deuReqs = extractRequirements('DEU', testAmount);
        expect(deuBucket).toBe('above_threshold');
        expect(deuReqs?.kyc_required).toBe(true);

        // ZAF should be at threshold boundary
        const zafBucket = getThresholdBucket('ZAF', testAmount);
        const zafReqs = extractRequirements('ZAF', testAmount);
        expect(zafBucket).toBe('above_threshold');
        expect(zafReqs?.kyc_required).toBe(true);
      });
    });
  });
});
