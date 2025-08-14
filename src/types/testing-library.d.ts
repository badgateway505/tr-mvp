import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace jest {
    interface Matchers<R, T> extends TestingLibraryMatchers<T, R> {}
  }
}

declare module 'vitest' {
  interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, void> {}
}

declare module '@vitest/expect' {
  interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, void> {}
}

// Extend the global expect interface
declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends TestingLibraryMatchers<T, void> {}
  }
  
  // Also extend the global expect function
  const expect: {
    <T = any>(actual: T): TestingLibraryMatchers<T, void> & {
      toBeInTheDocument(): void;
      toHaveClass(className: string): void;
      toHaveAttribute(attr: string, value?: string): void;
      toHaveTextContent(text: string | RegExp): void;
      toBeVisible(): void;
      toBeDisabled(): void;
      toBeEnabled(): void;
      toBeRequired(): void;
      toHaveValue(value: string | string[] | number): void;
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): void;
      toBeChecked(): void;
      toHaveFocus(): void;
      toHaveFormValues(expectedValues: Record<string, any>): void;
      toHaveStyle(css: string | Record<string, any>): void;
      toHaveAccessibleName(name: string | RegExp): void;
      toHaveAccessibleDescription(description: string | RegExp): void;
    };
  };
}
