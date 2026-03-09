import { create } from 'zustand';

type UiState = {
  globalError: string | null;
  setGlobalError: (message: string | null) => void;
  clearGlobalError: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  globalError: null,
  setGlobalError: (message) => set({ globalError: message }),
  clearGlobalError: () => set({ globalError: null }),
}));
