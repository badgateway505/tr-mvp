import { create } from 'zustand';

export type Direction = 'IN' | 'OUT';
export type EntityType = 'individual';

export interface AppState {
  // Core state fields
  sumsubCountry: string;
  counterpartyCountry: string;
  direction: Direction;
  amount: number;
  entityType: EntityType;
  
  // Actions
  setSumsubCountry: (country: string) => void;
  setCounterpartyCountry: (country: string) => void;
  setDirection: (direction: Direction) => void;
  setAmount: (amount: number) => void;
  setEntityType: (entityType: EntityType) => void;
  resetState: () => void;
}

const initialState = {
  sumsubCountry: '',
  counterpartyCountry: '',
  direction: 'OUT' as Direction,
  amount: 0,
  entityType: 'individual' as EntityType,
};

export const useAppState = create<AppState>((set) => ({
  ...initialState,
  
  setSumsubCountry: (country: string) => set({ sumsubCountry: country }),
  setCounterpartyCountry: (country: string) => set({ counterpartyCountry: country }),
  setDirection: (direction: Direction) => set({ direction }),
  setAmount: (amount: number) => set({ amount }),
  setEntityType: (entityType: EntityType) => set({ entityType }),
  resetState: () => set(initialState),
}));
