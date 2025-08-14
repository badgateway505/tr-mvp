import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Configure testing-library for vitest
afterEach(() => {
  cleanup();
});

// Configure jest-dom matchers
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
