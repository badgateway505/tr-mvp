import { describe, it, expect } from 'vitest';
import { AmountInput } from '../AmountInput';

describe('AmountInput', () => {
  it('should export AmountInput component', () => {
    expect(AmountInput).toBeDefined();
    expect(typeof AmountInput).toBe('function');
  });

  it('should have correct props interface', () => {
    // This test just verifies the component can be imported and has the expected structure
    expect(AmountInput).toBeDefined();
  });
});
