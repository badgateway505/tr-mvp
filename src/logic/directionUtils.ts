import type { Direction } from './useAppState';

/**
 * Determine sender and receiver based on direction
 * @param direction - The transaction direction ('IN' or 'OUT')
 * @returns Object with sender and receiver labels
 */
export function getDirectionLabels(direction: Direction) {
  if (direction === 'OUT') {
    return {
      sender: 'Sumsub',
      receiver: 'Counterparty',
    };
  } else {
    return {
      sender: 'Counterparty',
      receiver: 'Sumsub',
    };
  }
}

/**
 * Get the appropriate label for Sumsub based on direction
 * @param direction - The transaction direction ('IN' or 'OUT')
 * @returns Label for Sumsub's role
 */
export function getSumsubLabel(direction: Direction): string {
  return direction === 'OUT' ? 'Sender' : 'Receiver';
}

/**
 * Get the appropriate label for Counterparty based on direction
 * @param direction - The transaction direction ('IN' or 'OUT')
 * @returns Label for Counterparty's role
 */
export function getCounterpartyLabel(direction: Direction): string {
  return direction === 'OUT' ? 'Receiver' : 'Sender';
}
