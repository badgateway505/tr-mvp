import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Configure testing-library for vitest
afterEach(() => {
  cleanup();
});

// Extend expect with all jest-dom matchers
expect.extend(matchers);

// Extend expect types to include jest-dom matchers
declare module 'vitest' {
  interface Assertion<T = any> extends matchers.TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends matchers.TestingLibraryMatchers<any, void> {}
}

// Also extend the global expect interface for better compatibility
declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends matchers.TestingLibraryMatchers<T, void> {}
  }
}
