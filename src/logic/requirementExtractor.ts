import type { CountryCode, IndividualBranch } from '../types/requirements';
import { getCountryRule } from './loadRequirements';
import { getThresholdBucket } from './thresholdUtils';

export interface ExtractedRequirements {
  fields: string[];
  groups?: Array<{
    logic: 'AND' | 'OR';
    fields: string[];
  }>;
  kyc_required: boolean;
  aml_required: boolean;
  wallet_attribution: boolean;
}

/**
 * Extract requirements (fields, groups, and flags) for a given country and amount
 * @param countryCode - The country code to extract requirements from
 * @param amount - The amount to determine threshold bucket
 * @returns Extracted requirements or undefined if country not found
 */
export function extractRequirements(
  countryCode: CountryCode,
  amount: number
): ExtractedRequirements | undefined {
  const countryRule = getCountryRule(countryCode);
  if (!countryRule) {
    return undefined;
  }

  const thresholdBucket = getThresholdBucket(countryCode, amount);
  if (!thresholdBucket) {
    return undefined;
  }

  const individualBranch = countryRule.individual[thresholdBucket];
  return extractFromRuleBlock(individualBranch);
}

/**
 * Extract requirements from a specific individual branch
 * @param individualBranch - The individual branch containing fields/groups and flags
 * @returns Extracted requirements
 */
export function extractFromRuleBlock(individualBranch: IndividualBranch[keyof IndividualBranch]): ExtractedRequirements {
  const result: ExtractedRequirements = {
    fields: [],
    kyc_required: individualBranch.kyc_required,
    aml_required: individualBranch.aml_required,
    wallet_attribution: individualBranch.wallet_attribution
  };

  // Extract fields or groups
  if ('required_fields' in individualBranch) {
    result.fields = individualBranch.required_fields;
  } else if ('requirement_groups' in individualBranch) {
    result.groups = individualBranch.requirement_groups.map(group => ({
      logic: group.logic,
      fields: group.fields
    }));
  }

  return result;
}

/**
 * Get requirements for both threshold buckets of a country
 * @param countryCode - The country code to get requirements for
 * @returns Object with both below and above threshold requirements
 */
export function getAllRequirements(countryCode: CountryCode) {
  const countryRule = getCountryRule(countryCode);
  if (!countryRule) {
    return undefined;
  }

  return {
    below_threshold: extractFromRuleBlock(countryRule.individual.below_threshold),
    above_threshold: extractFromRuleBlock(countryRule.individual.above_threshold),
    threshold: countryRule.threshold
  };
}

/**
 * Check if a country has requirement groups (complex requirements)
 * @param countryCode - The country code to check
 * @param amount - The amount to determine threshold bucket
 * @returns True if the country uses requirement groups for the given amount
 */
export function hasRequirementGroups(
  countryCode: CountryCode,
  amount: number
): boolean {
  const requirements = extractRequirements(countryCode, amount);
  return requirements?.groups !== undefined && requirements.groups.length > 0;
}

/**
 * Check if a country has simple required fields
 * @param countryCode - The country code to check
 * @param amount - The amount to determine threshold bucket
 * @returns True if the country uses simple required fields for the given amount
 */
export function hasRequiredFields(
  countryCode: CountryCode,
  amount: number
): boolean {
  const requirements = extractRequirements(countryCode, amount);
  return requirements?.fields !== undefined && requirements.fields.length > 0;
}
