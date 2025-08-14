import type { CountryCode } from '../types/requirements';
import { getCountryRule } from './loadRequirements';

export type ThresholdBucket = 'below_threshold' | 'above_threshold';

/**
 * Get the threshold bucket for a given country and amount
 * @param countryCode - The country code to check
 * @param amount - The amount to compare against the threshold
 * @returns The threshold bucket ('below_threshold' or 'above_threshold') or undefined if country not found
 */
export function getThresholdBucket(
  countryCode: CountryCode,
  amount: number
): ThresholdBucket | undefined {
  const countryRule = getCountryRule(countryCode);
  if (!countryRule) {
    return undefined;
  }

  return amount < countryRule.threshold ? 'below_threshold' : 'above_threshold';
}

/**
 * Get the threshold value for a given country
 * @param countryCode - The country code to check
 * @returns The threshold value or undefined if country not found
 */
export function getCountryThreshold(
  countryCode: CountryCode
): number | undefined {
  const countryRule = getCountryRule(countryCode);
  return countryRule?.threshold;
}

/**
 * Check if an amount is above threshold for a given country
 * @param countryCode - The country code to check
 * @param amount - The amount to compare
 * @returns True if amount is above threshold, false if below, undefined if country not found
 */
export function isAmountAboveThreshold(
  countryCode: CountryCode,
  amount: number
): boolean | undefined {
  const countryRule = getCountryRule(countryCode);
  if (!countryRule) {
    return undefined;
  }

  return amount >= countryRule.threshold;
}

/**
 * Get both threshold buckets for comparison purposes
 * @param countryCode - The country code to check
 * @returns Object with both threshold buckets or undefined if country not found
 */
export function getThresholdBuckets(countryCode: CountryCode) {
  const countryRule = getCountryRule(countryCode);
  if (!countryRule) {
    return undefined;
  }

  return {
    below_threshold: countryRule.individual.below_threshold,
    above_threshold: countryRule.individual.above_threshold,
    threshold: countryRule.threshold,
  };
}
