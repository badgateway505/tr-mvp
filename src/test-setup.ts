import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Configure testing-library for vitest
afterEach(() => {
  cleanup();
});

// Configure jest-dom matchers and extend expect types
expect.extend(matchers);

// Extend expect types to include jest-dom matchers
declare module 'vitest' {
  interface Assertion<T = any> extends matchers.TestingLibraryMatchers<T, void> {}
}
