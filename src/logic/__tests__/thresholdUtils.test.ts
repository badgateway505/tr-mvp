import { describe, it, expect } from 'vitest';
import {
  getThresholdBucket,
  getCountryThreshold,
  isAmountAboveThreshold,
  getThresholdBuckets,
} from '../thresholdUtils';

describe('thresholdUtils', () => {
  describe('getThresholdBucket', () => {
    it('should return above_threshold for DEU with amount 0', () => {
      expect(getThresholdBucket('DEU', 0)).toBe('above_threshold');
    });

    it('should return above_threshold for DEU with amount 1', () => {
      expect(getThresholdBucket('DEU', 1)).toBe('above_threshold');
    });

    it('should return below_threshold for ZAF with amount 4999', () => {
      expect(getThresholdBucket('ZAF', 4999)).toBe('below_threshold');
    });

    it('should return above_threshold for ZAF with amount 5000', () => {
      expect(getThresholdBucket('ZAF', 5000)).toBe('above_threshold');
    });

    it('should return above_threshold for ZAF with amount 5001', () => {
      expect(getThresholdBucket('ZAF', 5001)).toBe('above_threshold');
    });

    it('should return undefined for invalid country', () => {
      expect(getThresholdBucket('INVALID' as any, 1000)).toBeUndefined();
    });
  });

  describe('getCountryThreshold', () => {
    it('should return 0 for DEU', () => {
      expect(getCountryThreshold('DEU')).toBe(0);
    });

    it('should return 5000 for ZAF', () => {
      expect(getCountryThreshold('ZAF')).toBe(5000);
    });

    it('should return undefined for invalid country', () => {
      expect(getCountryThreshold('INVALID' as any)).toBeUndefined();
    });
  });

  describe('isAmountAboveThreshold', () => {
    it('should return true for DEU with amount 0', () => {
      expect(isAmountAboveThreshold('DEU', 0)).toBe(true);
    });

    it('should return true for DEU with amount 1', () => {
      expect(isAmountAboveThreshold('DEU', 1)).toBe(true);
    });

    it('should return false for ZAF with amount 4999', () => {
      expect(isAmountAboveThreshold('ZAF', 4999)).toBe(false);
    });

    it('should return true for ZAF with amount 5000', () => {
      expect(isAmountAboveThreshold('ZAF', 5000)).toBe(true);
    });

    it('should return true for ZAF with amount 5001', () => {
      expect(isAmountAboveThreshold('ZAF', 5001)).toBe(true);
    });

    it('should return undefined for invalid country', () => {
      expect(isAmountAboveThreshold('INVALID' as any, 1000)).toBeUndefined();
    });
  });

  describe('getThresholdBuckets', () => {
    it('should return both buckets for DEU', () => {
      const result = getThresholdBuckets('DEU');
      expect(result).toBeDefined();
      expect(result?.threshold).toBe(0);
      expect(result?.below_threshold).toBeDefined();
      expect(result?.above_threshold).toBeDefined();
    });

    it('should return both buckets for ZAF', () => {
      const result = getThresholdBuckets('ZAF');
      expect(result).toBeDefined();
      expect(result?.threshold).toBe(5000);
      expect(result?.below_threshold).toBeDefined();
      expect(result?.above_threshold).toBeDefined();
    });

    it('should return undefined for invalid country', () => {
      expect(getThresholdBuckets('INVALID' as any)).toBeUndefined();
    });
  });
});
