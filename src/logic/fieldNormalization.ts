import { normalizeFieldName } from './normalizeFieldName';

export interface NormalizedField {
  original: string;
  normalized: string;
  isCombo: boolean;
  comboFields: string[];
}

/**
 * Normalize a field name and extract combo field information
 * @param field - The raw field name to normalize
 * @returns NormalizedField object with metadata
 */
export function normalizeField(field: string): NormalizedField {
  const normalized = normalizeFieldName(field);
  const isCombo = field.includes(' + ');
  
  let comboFields: string[] = [];
  if (isCombo) {
    comboFields = field.split(' + ').map(f => f.trim());
  }

  return {
    original: field,
    normalized,
    isCombo,
    comboFields
  };
}

/**
 * Normalize an array of field names
 * @param fields - Array of raw field names
 * @returns Array of NormalizedField objects
 */
export function normalizeFields(fields: string[]): NormalizedField[] {
  return fields.map(normalizeField);
}

/**
 * Check if two fields match (considering normalization and combo fields)
 * @param field1 - First field to compare
 * @param field2 - Second field to compare
 * @returns True if fields match
 */
export function fieldsMatch(field1: string, field2: string): boolean {
  const normalized1 = normalizeField(field1);
  const normalized2 = normalizeField(field2);

  // Direct normalized match
  if (normalized1.normalized === normalized2.normalized) {
    return true;
  }

  // Check if one is a combo field that contains the other
  if (normalized1.isCombo && normalized2.isCombo) {
    // Both are combo fields - check if they share any combo components
    const commonFields = normalized1.comboFields.filter(f => 
      normalized2.comboFields.includes(f)
    );
    return commonFields.length > 0;
  }

  // Check if one field is part of a combo field
  if (normalized1.isCombo) {
    return normalized1.comboFields.includes(normalized2.normalized);
  }

  if (normalized2.isCombo) {
    return normalized2.comboFields.includes(normalized1.normalized);
  }

  return false;
}

/**
 * Find matching fields between two arrays of field names
 * @param fields1 - First array of field names
 * @param fields2 - Second array of field names
 * @returns Array of matching field pairs
 */
export function findMatchingFields(fields1: string[], fields2: string[]): Array<{
  field1: string;
  field2: string;
  matchType: 'exact' | 'combo' | 'partial';
}> {
  const matches: Array<{
    field1: string;
    field2: string;
    matchType: 'exact' | 'combo' | 'partial';
  }> = [];

  for (const field1 of fields1) {
    for (const field2 of fields2) {
      if (fieldsMatch(field1, field2)) {
        const normalized1 = normalizeField(field1);
        const normalized2 = normalizeField(field2);
        
        let matchType: 'exact' | 'combo' | 'partial';
        if (normalized1.normalized === normalized2.normalized) {
          matchType = 'exact';
        } else if (normalized1.isCombo || normalized2.isCombo) {
          matchType = 'combo';
        } else {
          matchType = 'partial';
        }

        matches.push({ field1, field2, matchType });
      }
    }
  }

  return matches;
}

/**
 * Get all unique normalized field names from an array
 * @param fields - Array of raw field names
 * @returns Array of unique normalized field names
 */
export function getUniqueNormalizedFields(fields: string[]): string[] {
  const normalized = normalizeFields(fields);
  const unique = new Set(normalized.map(f => f.normalized));
  return Array.from(unique);
}

/**
 * Check if a field is a combo field
 * @param field - The field to check
 * @returns True if the field is a combo field
 */
export function isComboField(field: string): boolean {
  return field.includes(' + ');
}

/**
 * Split a combo field into individual fields
 * @param field - The combo field to split
 * @returns Array of individual field names
 */
export function splitComboField(field: string): string[] {
  if (!isComboField(field)) {
    return [field];
  }
  return field.split(' + ').map(f => f.trim());
}
