import { create } from 'zustand';
import type { AuthSession } from '../../domain/entities/auth';

const storageKey = 'insurance-frontend-auth';

type AuthState = {
  accessToken: string | null;
  tokenType: string | null;
  email: string | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  hydrateSession: () => void;
};

function persistSession(session: Pick<AuthState, 'accessToken' | 'tokenType' | 'email'>): void {
  localStorage.setItem(storageKey, JSON.stringify(session));
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  tokenType: null,
  email: null,
  isAuthenticated: false,
  setSession: (session) => {
    persistSession(session);
    set({
      accessToken: session.accessToken,
      tokenType: session.tokenType,
      email: session.email,
      isAuthenticated: true,
    });
  },
  clearSession: () => {
    localStorage.removeItem(storageKey);
    set({
      accessToken: null,
      tokenType: null,
      email: null,
      isAuthenticated: false,
    });
  },
  hydrateSession: () => {
    const rawValue = localStorage.getItem(storageKey);
    if (!rawValue) {
      return;
    }

    try {
      const parsed = JSON.parse(rawValue) as Pick<AuthState, 'accessToken' | 'tokenType' | 'email'>;
      if (!parsed.accessToken || !parsed.tokenType || !parsed.email) {
        localStorage.removeItem(storageKey);
        return;
      }

      set({
        accessToken: parsed.accessToken,
        tokenType: parsed.tokenType,
        email: parsed.email,
        isAuthenticated: true,
      });
    } catch {
      localStorage.removeItem(storageKey);
    }
  },
}));
