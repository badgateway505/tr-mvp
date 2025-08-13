/**
 * Amount validation utility
 * Ensures input contains only digits and converts to integer
 */

/**
 * Validates and parses amount input
 * @param input - Raw input string
 * @returns Parsed integer amount, or null if invalid
 */
export function validateAmount(input: string): number | null {
  // Remove any whitespace
  const trimmed = input.trim();
  
  // Check if input is empty
  if (trimmed === '') {
    return null;
  }
  
  // Check if input contains only digits
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }
  
  // Parse to integer
  const amount = parseInt(trimmed, 10);
  
  // Ensure it's a valid integer (handles edge cases like very large numbers)
  if (!Number.isInteger(amount) || amount < 0) {
    return null;
  }
  
  return amount;
}

/**
 * Formats amount for display (adds thousand separators)
 * @param amount - Integer amount
 * @returns Formatted string
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString();
}

/**
 * Checks if a string contains only digits
 * @param input - Input string to check
 * @returns True if input contains only digits
 */
export function isDigitsOnly(input: string): boolean {
  return /^\d*$/.test(input);
}
