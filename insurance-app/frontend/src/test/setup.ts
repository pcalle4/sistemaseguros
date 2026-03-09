import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { useAuthStore } from '../presentation/store/auth.store';
import { useQuoteStore } from '../presentation/store/quote.store';
import { useUiStore } from '../presentation/store/ui.store';

afterEach(() => {
  cleanup();
  localStorage.clear();
  useAuthStore.getState().clearSession();
  useQuoteStore.getState().clearQuote();
  useUiStore.getState().clearGlobalError();
  vi.clearAllMocks();
});
