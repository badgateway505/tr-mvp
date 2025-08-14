import { describe, it, expect } from 'vitest';
import { DirectionToggle } from '../DirectionToggle';

describe('DirectionToggle', () => {
  it('should export DirectionToggle component', () => {
    expect(DirectionToggle).toBeDefined();
    expect(typeof DirectionToggle).toBe('function');
  });

  it('should have correct props interface', () => {
    // This test just verifies the component can be imported and has the expected structure
    expect(DirectionToggle).toBeDefined();
  });
});
