import { describe, it, expect } from 'vitest';
import {
  extractRequirements,
  extractFromRuleBlock,
  getAllRequirements,
  hasRequirementGroups,
  hasRequiredFields,
} from '../requirementExtractor';

describe('requirementExtractor', () => {
  describe('extractRequirements', () => {
    it('should extract below_threshold requirements for ZAF with amount 4999', () => {
      const result = extractRequirements('ZAF', 4999);
      expect(result).toBeDefined();
      expect(result?.fields).toEqual(['full_name']);
      expect(result?.kyc_required).toBe(false);
      expect(result?.aml_required).toBe(false);
      expect(result?.wallet_attribution).toBe(false);
      expect(result?.groups).toBeUndefined();
    });

    it('should extract above_threshold requirements for ZAF with amount 5000', () => {
      const result = extractRequirements('ZAF', 5000);
      expect(result).toBeDefined();
      expect(result?.fields).toEqual([]);
      expect(result?.groups).toBeDefined();
      expect(result?.groups).toHaveLength(2);
      expect(result?.groups?.[0]).toEqual({
        logic: 'AND',
        fields: ['full_name', 'date_of_birth + birthplace'],
      });
      expect(result?.groups?.[1]).toEqual({
        logic: 'OR',
        fields: ['id_document_number', 'passport_number'],
      });
      expect(result?.kyc_required).toBe(true);
      expect(result?.aml_required).toBe(true);
      expect(result?.wallet_attribution).toBe(true);
    });

    it('should extract above_threshold requirements for DEU with amount 0', () => {
      const result = extractRequirements('DEU', 0);
      expect(result).toBeDefined();
      expect(result?.fields).toEqual([
        'full_name',
        'date_of_birth',
        'id_document_number',
        'residential_address',
      ]);
      expect(result?.kyc_required).toBe(true);
      expect(result?.aml_required).toBe(true);
      expect(result?.wallet_attribution).toBe(false);
      expect(result?.groups).toBeUndefined();
    });

    it('should return undefined for invalid country', () => {
      const result = extractRequirements('INVALID' as string, 1000);
      expect(result).toBeUndefined();
    });
  });

  describe('extractFromRuleBlock', () => {
    it('should extract from rule block with required_fields', () => {
      const individualBranch = {
        required_fields: ['field1', 'field2'],
        kyc_required: true,
        aml_required: false,
        wallet_attribution: true,
      };

      const result = extractFromRuleBlock(individualBranch);
      expect(result.fields).toEqual(['field1', 'field2']);
      expect(result.groups).toBeUndefined();
      expect(result.kyc_required).toBe(true);
      expect(result.aml_required).toBe(false);
      expect(result.wallet_attribution).toBe(true);
    });

    it('should extract from rule block with requirement_groups', () => {
      const individualBranch = {
        requirement_groups: [
          {
            logic: 'AND' as const,
            fields: ['field1', 'field2'],
          },
          {
            logic: 'OR' as const,
            fields: ['field3', 'field4'],
          },
        ],
        kyc_required: false,
        aml_required: true,
        wallet_attribution: false,
      };

      const result = extractFromRuleBlock(individualBranch);
      expect(result.fields).toEqual([]);
      expect(result.groups).toBeDefined();
      expect(result.groups).toHaveLength(2);
      expect(result.kyc_required).toBe(false);
      expect(result.aml_required).toBe(true);
      expect(result.wallet_attribution).toBe(false);
    });
  });

  describe('getAllRequirements', () => {
    it('should get all requirements for DEU', () => {
      const result = getAllRequirements('DEU');
      expect(result).toBeDefined();
      expect(result?.threshold).toBe(0);
      expect(result?.below_threshold.fields).toEqual([
        'full_name',
        'date_of_birth',
      ]);
      expect(result?.above_threshold.fields).toEqual([
        'full_name',
        'date_of_birth',
        'id_document_number',
        'residential_address',
      ]);
    });

    it('should get all requirements for ZAF', () => {
      const result = getAllRequirements('ZAF');
      expect(result).toBeDefined();
      expect(result?.threshold).toBe(5000);
      expect(result?.below_threshold.fields).toEqual(['full_name']);
      expect(result?.below_threshold.groups).toBeUndefined();
      expect(result?.above_threshold.groups).toBeDefined();
      expect(result?.above_threshold.groups).toHaveLength(2);
    });

    it('should return undefined for invalid country', () => {
      const result = getAllRequirements('INVALID' as string);
      expect(result).toBeUndefined();
    });
  });

  describe('hasRequirementGroups', () => {
    it('should return false for ZAF below threshold', () => {
      expect(hasRequirementGroups('ZAF', 4999)).toBe(false);
    });

    it('should return true for ZAF above threshold', () => {
      expect(hasRequirementGroups('ZAF', 5000)).toBe(true);
    });

    it('should return false for DEU (always uses required_fields)', () => {
      expect(hasRequirementGroups('DEU', 0)).toBe(false);
      expect(hasRequirementGroups('DEU', 1000)).toBe(false);
    });
  });

  describe('hasRequiredFields', () => {
    it('should return true for ZAF below threshold', () => {
      expect(hasRequiredFields('ZAF', 4999)).toBe(true);
    });

    it('should return false for ZAF above threshold', () => {
      expect(hasRequiredFields('ZAF', 5000)).toBe(false);
    });

    it('should return true for DEU (always uses required_fields)', () => {
      expect(hasRequiredFields('DEU', 0)).toBe(true);
      expect(hasRequiredFields('DEU', 1000)).toBe(true);
    });
  });
});
