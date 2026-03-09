import { create } from 'zustand';
import type { Policy } from '../../domain/entities/policy';
import type { Quote } from '../../domain/entities/quote';

type QuoteState = {
  currentQuote: Quote | null;
  currentPolicy: Policy | null;
  setQuote: (quote: Quote) => void;
  clearQuote: () => void;
  setPolicy: (policy: Policy) => void;
  clearPolicy: () => void;
};

export const useQuoteStore = create<QuoteState>((set) => ({
  currentQuote: null,
  currentPolicy: null,
  setQuote: (quote) => set({ currentQuote: quote, currentPolicy: null }),
  clearQuote: () => set({ currentQuote: null, currentPolicy: null }),
  setPolicy: (policy) => set({ currentPolicy: policy }),
  clearPolicy: () => set({ currentPolicy: null }),
}));
