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
    comboFields = field.split(' + ').map((f) => f.trim());
  }

  return {
    original: field,
    normalized,
    isCombo,
    comboFields,
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
    const commonFields = normalized1.comboFields.filter((f) =>
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
export function findMatchingFields(
  fields1: string[],
  fields2: string[]
): Array<{
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
  const normalizedSet = new Set<string>();

  fields.forEach((field) => {
    const normalized = normalizeField(field);
    normalizedSet.add(normalized.normalized);
  });

  return Array.from(normalizedSet);
}

/**
 * Build a field presence map showing which normalized fields exist on each side
 * @param applicantFields - Raw field names from applicant side
 * @param counterpartyFields - Raw field names from counterparty side
 * @returns Map of normalized field keys to presence information
 */
export function buildFieldPresenceMap(
  applicantFields: string[],
  counterpartyFields: string[]
): Map<string, { inApplicant: boolean; inCounterparty: boolean }> {
  const presenceMap = new Map<
    string,
    { inApplicant: boolean; inCounterparty: boolean }
  >();

  // Get all unique normalized fields from both sides
  const applicantNormalized = getUniqueNormalizedFields(applicantFields);
  const counterpartyNormalized = getUniqueNormalizedFields(counterpartyFields);

  // Create a set of all unique normalized fields across both sides
  const allNormalizedFields = new Set([
    ...applicantNormalized,
    ...counterpartyNormalized,
  ]);

  // Build the presence map
  for (const normalizedField of allNormalizedFields) {
    presenceMap.set(normalizedField, {
      inApplicant: applicantNormalized.includes(normalizedField),
      inCounterparty: counterpartyNormalized.includes(normalizedField),
    });
  }

  return presenceMap;
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
  return field.split(' + ').map((f) => f.trim());
}

/**
 * Build comparable sets for both sides with OR-group satisfaction logic
 * @param applicantRequirements - Requirements from the applicant side
 * @param counterpartyRequirements - Requirements from the counterparty side
 * @returns Object with normalized sets and pairing information
 */
export function buildComparableSets(
  applicantRequirements: {
    fields?: string[];
    groups?: Array<{ logic: 'AND' | 'OR'; fields: string[] }>;
  },
  counterpartyRequirements: {
    fields?: string[];
    groups?: Array<{ logic: 'AND' | 'OR'; fields: string[] }>;
  }
) {
  // Normalize applicant fields (including OR-group satisfaction)
  const applicantFields = new Set<string>();
  const applicantGroups = new Map<
    string,
    { logic: 'AND' | 'OR'; fields: string[]; satisfied: boolean }
  >();

  // Process simple fields
  if (applicantRequirements.fields) {
    applicantRequirements.fields.forEach((field) => {
      applicantFields.add(field);
    });
  }

  // Process groups with OR-group satisfaction logic
  if (applicantRequirements.groups) {
    applicantRequirements.groups.forEach((group, index) => {
      const groupKey = `group_${index}`;

      // For OR groups, we'll track which fields are satisfied
      // For AND groups, all fields are required
      applicantGroups.set(groupKey, {
        logic: group.logic,
        fields: group.fields,
        satisfied: false, // Will be updated during matching
      });

      // Add all fields to the set for comparison
      group.fields.forEach((field) => {
        applicantFields.add(field);
      });
    });
  }

  // Normalize counterparty fields (including OR-group satisfaction)
  const counterpartyFields = new Set<string>();
  const counterpartyGroups = new Map<
    string,
    { logic: 'AND' | 'OR'; fields: string[]; satisfied: boolean }
  >();

  // Process simple fields
  if (counterpartyRequirements.fields) {
    counterpartyRequirements.fields.forEach((field) => {
      counterpartyFields.add(field);
    });
  }

  // Process groups
  if (counterpartyRequirements.groups) {
    counterpartyRequirements.groups.forEach((group, index) => {
      const groupKey = `group_${index}`;

      counterpartyGroups.set(groupKey, {
        logic: group.logic,
        fields: group.fields,
        satisfied: false, // Will be updated during matching
      });

      // Add all fields to the set for comparison
      group.fields.forEach((field) => {
        counterpartyFields.add(field);
      });
    });
  }

  // Build field pairing map for hover interactions
  const fieldPairings = new Map<string, string[]>();
  const reversePairings = new Map<string, string[]>();

  // Find all matches between the two sides
  for (const applicantField of applicantFields) {
    const matches: string[] = [];

    for (const counterpartyField of counterpartyFields) {
      if (fieldsMatch(applicantField, counterpartyField)) {
        matches.push(counterpartyField);
      }
    }

    if (matches.length > 0) {
      fieldPairings.set(applicantField, matches);

      // Build reverse mappings
      matches.forEach((match) => {
        if (!reversePairings.has(match)) {
          reversePairings.set(match, []);
        }
        reversePairings.get(match)!.push(applicantField);
      });
    }
  }

  // Update group satisfaction based on matches
  // For OR groups: satisfied if ANY field matches
  // For AND groups: satisfied if ALL fields match
  for (const [, group] of applicantGroups) {
    if (group.logic === 'OR') {
      // OR group is satisfied if any field matches
      group.satisfied = group.fields.some((field) => fieldPairings.has(field));
    } else {
      // AND group is satisfied if all fields match
      group.satisfied = group.fields.every((field) => fieldPairings.has(field));
    }
  }

  for (const [, group] of counterpartyGroups) {
    if (group.logic === 'OR') {
      // OR group is satisfied if any field matches
      group.satisfied = group.fields.some((field) =>
        reversePairings.has(field)
      );
    } else {
      // AND group is satisfied if all fields match
      group.satisfied = group.fields.every((field) =>
        reversePairings.has(field)
      );
    }
  }

  return {
    applicantFields: Array.from(applicantFields),
    counterpartyFields: Array.from(counterpartyFields),
    applicantGroups: Array.from(applicantGroups.entries()),
    counterpartyGroups: Array.from(counterpartyGroups.entries()),
    fieldPairings,
    reversePairings,
    // Summary statistics
    totalMatches: fieldPairings.size,
    applicantMatchedFields: Array.from(fieldPairings.keys()),
    counterpartyMatchedFields: Array.from(reversePairings.keys()),
    // Field presence map for task 7.2
    fieldPresenceMap: buildFieldPresenceMap(
      Array.from(applicantFields),
      Array.from(counterpartyFields)
    ),
  };
}

/**
 * Check if a field has matches on the other side
 * @param field - The field to check
 * @param pairings - The field pairings map
 * @returns True if the field has matches
 */
export function hasMatches(
  field: string,
  pairings: Map<string, string[]>
): boolean {
  return pairings.has(field);
}

/**
 * Get all matching fields for a given field
 * @param field - The field to get matches for
 * @param pairings - The field pairings map
 * @returns Array of matching fields or empty array if no matches
 */
export function getMatchingFields(
  field: string,
  pairings: Map<string, string[]>
): string[] {
  return pairings.get(field) || [];
}

/**
 * Get the field presence map from the buildComparableSets result
 * @param comparableSets - Result from buildComparableSets function
 * @returns Map of normalized field keys to presence information
 */
export function getFieldPresenceMap(
  comparableSets: ReturnType<typeof buildComparableSets>
): Map<string, { inApplicant: boolean; inCounterparty: boolean }> {
  return comparableSets.fieldPresenceMap;
}

/**
 * Check if a normalized field is present on both sides
 * @param normalizedField - The normalized field name to check
 * @param presenceMap - The field presence map
 * @returns True if the field is present on both sides
 */
export function isFieldPresentOnBothSides(
  normalizedField: string,
  presenceMap: Map<string, { inApplicant: boolean; inCounterparty: boolean }>
): boolean {
  const presence = presenceMap.get(normalizedField);
  return presence ? presence.inApplicant && presence.inCounterparty : false;
}

/**
 * Compare field sets from both sides to determine compliance status
 * @param applicantRequirements - Requirements from the applicant side (Sumsub for OUT direction)
 * @param counterpartyRequirements - Requirements from the counterparty side
 * @param direction - Transaction direction ('IN' or 'OUT')
 * @returns Compliance status: 'match', 'overcompliance', or 'undercompliance'
 */
export function compareFieldSets(
  applicantRequirements: {
    fields?: string[];
    groups?: Array<{ logic: 'AND' | 'OR'; fields: string[] }>;
  },
  counterpartyRequirements: {
    fields?: string[];
    groups?: Array<{ logic: 'AND' | 'OR'; fields: string[] }>;
  },
  direction: 'IN' | 'OUT' = 'OUT'
): 'match' | 'overcompliance' | 'undercompliance' {
  // Build comparable sets to get normalized field information
  const comparableSets = buildComparableSets(
    applicantRequirements,
    counterpartyRequirements
  );

  // Get all unique normalized fields from both sides, expanding combo fields
  const applicantNormalized = expandComboFields(comparableSets.applicantFields);
  const counterpartyNormalized = expandComboFields(
    comparableSets.counterpartyFields
  );

  // Create sets for easier comparison
  const applicantSet = new Set(applicantNormalized);
  const counterpartySet = new Set(counterpartyNormalized);

  // Determine which side is the "sender" based on direction
  // For OUT direction: Sumsub (applicant) is sender, Counterparty is receiver
  // For IN direction: Counterparty is sender, Sumsub (applicant) is receiver
  const senderSet = direction === 'OUT' ? applicantSet : counterpartySet;
  const receiverSet = direction === 'OUT' ? counterpartySet : applicantSet;

  // Check if all fields required by the receiver are covered by the sender
  const receiverFields = Array.from(receiverSet);
  const allReceiverFieldsCovered = receiverFields.every((field) =>
    senderSet.has(field)
  );

  if (!allReceiverFieldsCovered) {
    // Some required fields are missing - undercompliance
    return 'undercompliance';
  }

  // Check if sender has additional fields beyond what receiver requires
  const senderFields = Array.from(senderSet);
  const hasAdditionalFields = senderFields.some(
    (field) => !receiverSet.has(field)
  );

  if (hasAdditionalFields) {
    // Sender has more fields than required - overcompliance
    return 'overcompliance';
  }

  // All required fields are covered and no additional fields - perfect match
  return 'match';
}

/**
 * Expand combo fields into individual normalized fields for comparison
 * @param fields - Array of raw field names (may include combo fields)
 * @returns Array of individual normalized field names
 */
function expandComboFields(fields: string[]): string[] {
  const expandedFields: string[] = [];

  fields.forEach((field) => {
    const normalized = normalizeField(field);

    if (normalized.isCombo) {
      // For combo fields, add each individual component
      normalized.comboFields.forEach((comboField) => {
        // Normalize each combo component individually
        const normalizedComboField = normalizeFieldName(comboField);
        expandedFields.push(normalizedComboField);
      });
    } else {
      // For regular fields, add the normalized field
      expandedFields.push(normalized.normalized);
    }
  });

  return expandedFields;
}
