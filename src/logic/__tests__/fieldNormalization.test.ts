import { describe, it, expect } from 'vitest';
import { 
  normalizeField, 
  normalizeFields,
  fieldsMatch,
  findMatchingFields,
  getUniqueNormalizedFields,
  isComboField,
  splitComboField
} from '../fieldNormalization';

describe('fieldNormalization', () => {
  describe('normalizeField', () => {
    it('should normalize a simple field', () => {
      const result = normalizeField('passportNumber');
      expect(result.original).toBe('passportNumber');
      expect(result.normalized).toBe('id_document_number');
      expect(result.isCombo).toBe(false);
      expect(result.comboFields).toEqual([]);
    });

    it('should handle a combo field', () => {
      const result = normalizeField('date_of_birth + birthplace');
      expect(result.original).toBe('date_of_birth + birthplace');
      expect(result.normalized).toBe('date_of_birth + birthplace');
      expect(result.isCombo).toBe(true);
      expect(result.comboFields).toEqual(['date_of_birth', 'birthplace']);
    });

    it('should handle a field with no normalization', () => {
      const result = normalizeField('unknown_field');
      expect(result.original).toBe('unknown_field');
      expect(result.normalized).toBe('unknown_field');
      expect(result.isCombo).toBe(false);
      expect(result.comboFields).toEqual([]);
    });
  });

  describe('normalizeFields', () => {
    it('should normalize an array of fields', () => {
      const fields = ['passportNumber', 'fullName', 'date_of_birth + birthplace'];
      const result = normalizeFields(fields);
      
      expect(result).toHaveLength(3);
      expect(result[0].normalized).toBe('id_document_number');
      expect(result[1].normalized).toBe('full_name');
      expect(result[2].normalized).toBe('date_of_birth + birthplace');
      expect(result[2].isCombo).toBe(true);
    });
  });

  describe('fieldsMatch', () => {
    it('should match identical fields', () => {
      expect(fieldsMatch('full_name', 'full_name')).toBe(true);
    });

    it('should match normalized fields', () => {
      expect(fieldsMatch('passportNumber', 'id_document_number')).toBe(true);
      expect(fieldsMatch('fullName', 'full_name')).toBe(true);
    });

    it('should match combo field with individual field', () => {
      expect(fieldsMatch('date_of_birth + birthplace', 'date_of_birth')).toBe(true);
      expect(fieldsMatch('date_of_birth', 'date_of_birth + birthplace')).toBe(true);
    });

    it('should match combo fields with common components', () => {
      expect(fieldsMatch('date_of_birth + birthplace', 'date_of_birth + city')).toBe(true);
    });

    it('should not match unrelated fields', () => {
      expect(fieldsMatch('full_name', 'id_document_number')).toBe(false);
      expect(fieldsMatch('date_of_birth', 'residential_address')).toBe(false);
    });

    it('should not match combo fields with no common components', () => {
      expect(fieldsMatch('date_of_birth + birthplace', 'full_name + id_document_number')).toBe(false);
    });
  });

  describe('findMatchingFields', () => {
    it('should find exact matches', () => {
      const fields1 = ['full_name', 'date_of_birth'];
      const fields2 = ['full_name', 'id_document_number'];
      
      const matches = findMatchingFields(fields1, fields2);
      expect(matches).toHaveLength(1);
      expect(matches[0].field1).toBe('full_name');
      expect(matches[0].field2).toBe('full_name');
      expect(matches[0].matchType).toBe('exact');
    });

    it('should find normalized matches', () => {
      const fields1 = ['passportNumber', 'fullName'];
      const fields2 = ['id_document_number', 'full_name'];
      
      const matches = findMatchingFields(fields1, fields2);
      expect(matches).toHaveLength(2);
      expect(matches[0].matchType).toBe('exact');
      expect(matches[1].matchType).toBe('exact');
    });

    it('should find combo field matches', () => {
      const fields1 = ['date_of_birth + birthplace'];
      const fields2 = ['date_of_birth', 'birthplace'];
      
      const matches = findMatchingFields(fields1, fields2);
      expect(matches).toHaveLength(2);
      expect(matches[0].matchType).toBe('combo');
      expect(matches[1].matchType).toBe('combo');
    });
  });

  describe('getUniqueNormalizedFields', () => {
    it('should return unique normalized fields', () => {
      const fields = ['passportNumber', 'passport_number', 'fullName'];
      const result = getUniqueNormalizedFields(fields);
      
      expect(result).toHaveLength(2);
      expect(result).toContain('id_document_number');
      expect(result).toContain('full_name');
    });
  });

  describe('isComboField', () => {
    it('should identify combo fields', () => {
      expect(isComboField('date_of_birth + birthplace')).toBe(true);
      expect(isComboField('full_name')).toBe(false);
    });
  });

  describe('splitComboField', () => {
    it('should split combo fields', () => {
      const result = splitComboField('date_of_birth + birthplace');
      expect(result).toEqual(['date_of_birth', 'birthplace']);
    });

    it('should return single field for non-combo fields', () => {
      const result = splitComboField('full_name');
      expect(result).toEqual(['full_name']);
    });
  });
});
