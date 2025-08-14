import { describe, it, expect } from 'vitest';
import {
  normalizeField,
  fieldsMatch,
  buildFieldPresenceMap,
  isFieldPresentOnBothSides,
  buildComparableSets,
  compareFieldSets,
} from '../fieldNormalization';

describe('Field Normalization', () => {
  describe('normalizeField', () => {
    it('should normalize a simple field name', () => {
      const result = normalizeField('passportNumber');
      expect(result.original).toBe('passportNumber');
      expect(result.normalized).toBe('id_document_number');
      expect(result.isCombo).toBe(false);
      expect(result.comboFields).toEqual([]);
    });

    it('should handle combo fields', () => {
      const result = normalizeField('date_of_birth + birthplace');
      expect(result.original).toBe('date_of_birth + birthplace');
      expect(result.normalized).toBe('date_of_birth + birthplace');
      expect(result.isCombo).toBe(true);
      expect(result.comboFields).toEqual(['date_of_birth', 'birthplace']);
    });
  });

  describe('fieldsMatch', () => {
    it('should match identical normalized fields', () => {
      expect(fieldsMatch('passportNumber', 'id_document_number')).toBe(true);
    });

    it('should match combo field with individual field', () => {
      expect(fieldsMatch('date_of_birth + birthplace', 'date_of_birth')).toBe(
        true
      );
      expect(fieldsMatch('date_of_birth', 'date_of_birth + birthplace')).toBe(
        true
      );
    });

    it('should match combo fields with shared components', () => {
      expect(
        fieldsMatch('date_of_birth + birthplace', 'date_of_birth + nationality')
      ).toBe(true);
    });

    it('should not match unrelated fields', () => {
      expect(fieldsMatch('passportNumber', 'date_of_birth')).toBe(false);
    });
  });

  describe('buildComparableSets', () => {
    it('should build comparable sets with OR-group satisfaction logic', () => {
      const applicantRequirements = {
        fields: ['passportNumber'],
        groups: [
          {
            logic: 'OR' as const,
            fields: ['date_of_birth', 'nationality'],
          },
        ],
      };

      const counterpartyRequirements = {
        fields: ['id_document_number'],
        groups: [
          {
            logic: 'OR' as const,
            fields: ['date_of_birth'],
          },
        ],
      };

      const result = buildComparableSets(
        applicantRequirements,
        counterpartyRequirements
      );

      // Check that OR groups are properly satisfied
      expect(result.applicantGroups).toHaveLength(1);
      const applicantGroup = result.applicantGroups[0];
      expect(applicantGroup[1].logic).toBe('OR');
      expect(applicantGroup[1].satisfied).toBe(true); // date_of_birth matches
      expect(applicantGroup[1].matchedFields).toContain('date_of_birth');

      expect(result.counterpartyGroups).toHaveLength(1);
      const counterpartyGroup = result.counterpartyGroups[0];
      expect(counterpartyGroup[1].logic).toBe('OR');
      expect(counterpartyGroup[1].satisfied).toBe(true); // date_of_birth matches
      expect(counterpartyGroup[1].matchedFields).toContain('date_of_birth');

      // Check field pairings
      expect(result.fieldPairings.has('passportNumber')).toBe(true);
      expect(result.fieldPairings.get('passportNumber')).toContain(
        'id_document_number'
      );
      expect(result.fieldPairings.has('date_of_birth')).toBe(true);
    });

    it('should handle AND groups correctly', () => {
      const applicantRequirements = {
        groups: [
          {
            logic: 'AND' as const,
            fields: ['date_of_birth', 'nationality'],
          },
        ],
      };

      const counterpartyRequirements = {
        groups: [
          {
            logic: 'AND' as const,
            fields: ['date_of_birth'],
          },
        ],
      };

      const result = buildComparableSets(
        applicantRequirements,
        counterpartyRequirements
      );

      // AND group should not be satisfied because not all fields match
      const applicantGroup = result.applicantGroups[0];
      expect(applicantGroup[1].logic).toBe('AND');
      expect(applicantGroup[1].satisfied).toBe(false);
      expect(applicantGroup[1].matchedFields).toContain('date_of_birth');
      expect(applicantGroup[1].matchedFields).not.toContain('nationality');
    });

    it('should handle empty requirements', () => {
      const result = buildComparableSets({}, {});
      expect(result.applicantFields).toEqual([]);
      expect(result.counterpartyFields).toEqual([]);
      expect(result.totalMatches).toBe(0);
    });
  });

  describe('Field Presence and Matching', () => {
    it('should build field presence map correctly', () => {
      const applicantFields = ['passportNumber', 'date_of_birth'];
      const counterpartyFields = ['id_document_number', 'nationality'];

      const presenceMap = buildFieldPresenceMap(
        applicantFields,
        counterpartyFields
      );

      // passportNumber and id_document_number should be present on both sides (normalized)
      expect(isFieldPresentOnBothSides('id_document_number', presenceMap)).toBe(
        true
      );

      // date_of_birth and nationality should not be present on both sides
      expect(isFieldPresentOnBothSides('date_of_birth', presenceMap)).toBe(
        false
      );
      expect(isFieldPresentOnBothSides('nationality', presenceMap)).toBe(false);
    });

    it('should handle combo fields in presence map', () => {
      const applicantFields = ['date_of_birth + birthplace'];
      const counterpartyFields = ['date_of_birth'];

      const presenceMap = buildFieldPresenceMap(
        applicantFields,
        counterpartyFields
      );

      // date_of_birth should be present on both sides
      expect(isFieldPresentOnBothSides('date_of_birth', presenceMap)).toBe(
        true
      );
    });
  });

  describe('Compliance Comparison', () => {
    it('should determine match status correctly', () => {
      const applicantRequirements = {
        fields: ['passportNumber', 'date_of_birth'],
      };

      const counterpartyRequirements = {
        fields: ['id_document_number', 'date_of_birth'],
      };

      const result = compareFieldSets(
        applicantRequirements,
        counterpartyRequirements,
        'OUT'
      );
      expect(result).toBe('match'); // All required fields are covered
    });

    it('should detect overcompliance', () => {
      const applicantRequirements = {
        fields: ['passportNumber', 'date_of_birth', 'nationality'],
      };

      const counterpartyRequirements = {
        fields: ['id_document_number', 'date_of_birth'],
      };

      const result = compareFieldSets(
        applicantRequirements,
        counterpartyRequirements,
        'OUT'
      );
      expect(result).toBe('overcompliance'); // Applicant has more fields than required
    });

    it('should detect undercompliance', () => {
      const applicantRequirements = {
        fields: ['passportNumber'],
      };

      const counterpartyRequirements = {
        fields: ['id_document_number', 'date_of_birth'],
      };

      const result = compareFieldSets(
        applicantRequirements,
        counterpartyRequirements,
        'OUT'
      );
      expect(result).toBe('undercompliance'); // Applicant missing required fields
    });
  });

  describe('Task 10.3: Enhanced Matching Behavior', () => {
    it('should properly implement OR-group satisfaction by any one field', () => {
      const applicantRequirements = {
        groups: [
          {
            logic: 'OR' as const,
            fields: ['field1', 'field2', 'field3'],
          },
        ],
      };

      const counterpartyRequirements = {
        groups: [
          {
            logic: 'OR' as const,
            fields: ['field2'], // Only one field matches
          },
        ],
      };

      const result = buildComparableSets(
        applicantRequirements,
        counterpartyRequirements
      );

      // OR group should be satisfied because at least one field matches
      const applicantGroup = result.applicantGroups[0];
      expect(applicantGroup[1].satisfied).toBe(true);
      expect(applicantGroup[1].matchedFields).toContain('field2');
      expect(applicantGroup[1].matchedFields).not.toContain('field1');
      expect(applicantGroup[1].matchedFields).not.toContain('field3');
    });

    it('should show unmatched fields with grey borders', () => {
      const applicantRequirements = {
        fields: ['matched_field', 'unmatched_field'],
      };

      const counterpartyRequirements = {
        fields: ['matched_field'],
      };

      const result = buildComparableSets(
        applicantRequirements,
        counterpartyRequirements
      );

      // Check that unmatched fields are properly identified
      expect(result.fieldPairings.has('matched_field')).toBe(true);
      expect(result.fieldPairings.has('unmatched_field')).toBe(false);

      // unmatched_field should not have any pairings
      expect(result.fieldPairings.get('unmatched_field')).toBeUndefined();
    });

    it('should handle hover matches for normalized names', () => {
      const applicantRequirements = {
        fields: ['passportNumber', 'date_of_birth'],
      };

      const counterpartyRequirements = {
        fields: ['id_document_number', 'date_of_birth'],
      };

      const result = buildComparableSets(
        applicantRequirements,
        counterpartyRequirements
      );

      // passportNumber should match id_document_number (normalized)
      expect(result.fieldPairings.has('passportNumber')).toBe(true);
      expect(result.fieldPairings.get('passportNumber')).toContain(
        'id_document_number'
      );

      // date_of_birth should match date_of_birth (exact)
      expect(result.fieldPairings.has('date_of_birth')).toBe(true);
      expect(result.fieldPairings.get('date_of_birth')).toContain(
        'date_of_birth'
      );
    });
  });
});
