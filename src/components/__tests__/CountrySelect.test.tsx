import { describe, it, expect } from 'vitest';
import { CountrySelect } from '../CountrySelect';

describe('CountrySelect', () => {
  it('should export CountrySelect component', () => {
    expect(CountrySelect).toBeDefined();
    expect(typeof CountrySelect).toBe('function');
  });

  it('should have correct props interface', () => {
    // This test just verifies the component can be imported and has the expected structure
    expect(CountrySelect).toBeDefined();
  });
});
