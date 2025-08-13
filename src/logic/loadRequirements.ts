import requirementsData from '../data/requirements.json';
import type { CountryCode, CountryRule, RequirementsJson } from '../types/requirements';

// Load and validate requirements data
const requirements: RequirementsJson = requirementsData as RequirementsJson;

/**
 * Get country rule by country code
 * @param code - Country code (e.g., 'DEU', 'ZAF')
 * @returns CountryRule or undefined if not found
 */
export function getCountryRule(code: CountryCode): CountryRule | undefined {
  return requirements[code];
}

/**
 * Get all available country codes
 * @returns Array of available country codes
 */
export function getAvailableCountryCodes(): CountryCode[] {
  return Object.keys(requirements) as CountryCode[];
}

/**
 * Check if a country code is supported
 * @param code - Country code to check
 * @returns boolean indicating if country is supported
 */
export function isCountrySupported(code: CountryCode): boolean {
  return code in requirements;
}

/**
 * Get all country rules
 * @returns Complete requirements data
 */
export function getAllCountryRules(): RequirementsJson {
  return requirements;
}
