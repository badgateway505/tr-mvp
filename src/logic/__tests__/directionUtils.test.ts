import { describe, it, expect } from 'vitest';
import {
  getDirectionLabels,
  getSumsubLabel,
  getCounterpartyLabel,
} from '../directionUtils';

describe('directionUtils', () => {
  describe('getDirectionLabels', () => {
    it('should return correct labels for OUT direction', () => {
      const result = getDirectionLabels('OUT');
      expect(result.sender).toBe('Sumsub');
      expect(result.receiver).toBe('Counterparty');
    });

    it('should return correct labels for IN direction', () => {
      const result = getDirectionLabels('IN');
      expect(result.sender).toBe('Counterparty');
      expect(result.receiver).toBe('Sumsub');
    });
  });

  describe('getSumsubLabel', () => {
    it('should return "Sender" for OUT direction', () => {
      expect(getSumsubLabel('OUT')).toBe('Sender');
    });

    it('should return "Receiver" for IN direction', () => {
      expect(getSumsubLabel('IN')).toBe('Receiver');
    });
  });

  describe('getCounterpartyLabel', () => {
    it('should return "Receiver" for OUT direction', () => {
      expect(getCounterpartyLabel('OUT')).toBe('Receiver');
    });

    it('should return "Sender" for IN direction', () => {
      expect(getCounterpartyLabel('IN')).toBe('Sender');
    });
  });
});
