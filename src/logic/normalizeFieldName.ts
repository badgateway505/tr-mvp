import fieldDictionary from '../data/fieldDictionary.json';

/**
 * Normalize a field name using the field dictionary mapping
 * @param field - The raw field name to normalize
 * @returns The normalized field name, or the original if no mapping exists
 */
export function normalizeFieldName(field: string): string {
  return fieldDictionary[field as keyof typeof fieldDictionary] || field;
}

/**
 * Get all available normalized field names
 * @returns Array of all normalized field names from the dictionary
 */
export function getNormalizedFields(): string[] {
  return Object.values(fieldDictionary);
}

/**
 * Get all raw field names that can be normalized
 * @returns Array of all raw field names from the dictionary
 */
export function getRawFields(): string[] {
  return Object.keys(fieldDictionary);
}
