import { create } from 'zustand';

/**
 * Transaction direction - determines which entity is the sender vs receiver
 */
export type Direction = 'IN' | 'OUT';

/**
 * Entity type for compliance requirements (currently only 'individual' supported)
 */
export type EntityType = 'individual';

/**
 * Application state interface for the Travel Rule Calculator
 * Manages country selection, transaction direction, amount, and entity type
 */
export interface AppState {
  // Core state fields
  /** Country code for Sumsub VASP (e.g., 'DEU', 'ZAF') */
  sumsubCountry: string;
  /** Country code for the counterparty VASP */
  counterpartyCountry: string;
  /** Transaction direction - determines sender/receiver roles */
  direction: Direction;
  /** Transaction amount in local currency (integer) */
  amount: number;
  /** Entity type for compliance requirements */
  entityType: EntityType;

  // Actions
  /** Set the Sumsub VASP country code */
  setSumsubCountry: (country: string) => void;
  /** Set the counterparty VASP country code */
  setCounterpartyCountry: (country: string) => void;
  /** Set the transaction direction (IN/OUT) */
  setDirection: (direction: Direction) => void;
  /** Set the transaction amount in local currency */
  setAmount: (amount: number) => void;
  /** Set the entity type for compliance requirements */
  setEntityType: (entityType: EntityType) => void;
  /** Reset all state to initial values */
  resetState: () => void;
}

/**
 * Initial state values for the application
 */
const initialState = {
  sumsubCountry: '',
  counterpartyCountry: '',
  direction: 'OUT' as Direction,
  amount: 0,
  entityType: 'individual' as EntityType,
};

/**
 * Zustand store hook for managing application state
 * 
 * Provides centralized state management for:
 * - Country selection (Sumsub and counterparty)
 * - Transaction direction and amount
 * - Entity type for compliance requirements
 * 
 * @returns AppState object with current state and action methods
 * 
 * @example
 * ```tsx
 * const { sumsubCountry, setSumsubCountry, amount, setAmount } = useAppState();
 * 
 * // Update country
 * setSumsubCountry('DEU');
 * 
 * // Update amount
 * setAmount(1500);
 * ```
 */
export const useAppState = create<AppState>((set) => ({
  ...initialState,

  setSumsubCountry: (country: string) => set({ sumsubCountry: country }),
  setCounterpartyCountry: (country: string) =>
    set({ counterpartyCountry: country }),
  setDirection: (direction: Direction) => set({ direction }),
  setAmount: (amount: number) => set({ amount }),
  setEntityType: (entityType: EntityType) => set({ entityType }),
  resetState: () => set(initialState),
}));
