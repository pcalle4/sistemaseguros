import { useState } from 'react';
import { normalizeApiError } from '../../core/utils/error-mapper';
import { services } from '../../infrastructure/container/services';
import { useAuthStore } from '../store/auth.store';

export function useAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const email = useAuthStore((state) => state.email);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const login = async (payload: { email: string; password: string }) => {
    setIsSubmittingLogin(true);

    try {
      const session = await services.login.execute(payload);
      setSession(session);
      return session;
    } catch (error) {
      throw normalizeApiError(error);
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  return {
    accessToken,
    email,
    isAuthenticated,
    isSubmittingLogin,
    login,
    logout: clearSession,
  };
}
