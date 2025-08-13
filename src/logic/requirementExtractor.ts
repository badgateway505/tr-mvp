import type { CountryCode, IndividualBranch, RuleBlock } from '../types/requirements';
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

  const ruleBlock = countryRule.individual[thresholdBucket];
  return extractFromRuleBlock(ruleBlock);
}

/**
 * Extract requirements from a specific rule block
 * @param ruleBlock - The rule block containing fields/groups and flags
 * @returns Extracted requirements
 */
export function extractFromRuleBlock(ruleBlock: RuleBlock): ExtractedRequirements {
  const result: ExtractedRequirements = {
    fields: [],
    kyc_required: false,
    aml_required: false,
    wallet_attribution: false
  };

  // Extract fields or groups
  if ('required_fields' in ruleBlock) {
    result.fields = ruleBlock.required_fields;
  } else if ('requirement_groups' in ruleBlock) {
    result.groups = ruleBlock.requirement_groups.map(group => ({
      logic: group.logic,
      fields: group.fields
    }));
  }

  // Extract flags
  if ('kyc_required' in ruleBlock) {
    result.kyc_required = ruleBlock.kyc_required;
  }
  if ('aml_required' in ruleBlock) {
    result.aml_required = ruleBlock.aml_required;
  }
  if ('wallet_attribution' in ruleBlock) {
    result.wallet_attribution = ruleBlock.wallet_attribution;
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
