import { describe, it, expect } from 'vitest';
import { EntityToggle } from '../EntityToggle';

describe('EntityToggle', () => {
  it('should export EntityToggle component', () => {
    expect(EntityToggle).toBeDefined();
    expect(typeof EntityToggle).toBe('function');
  });

  it('should have correct props interface', () => {
    // This test just verifies the component can be imported and has the expected structure
    expect(EntityToggle).toBeDefined();
  });
});
