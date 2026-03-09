import { useState } from 'react';
import { normalizeApiError } from '../../core/utils/error-mapper';
import { AppApiError } from '../../core/types/problem-details';
import { services } from '../../infrastructure/container/services';
import { useAuthStore } from '../store/auth.store';
import { useQuoteStore } from '../store/quote.store';
import { useUiStore } from '../store/ui.store';

export function usePolicy() {
  const setPolicy = useQuoteStore((state) => state.setPolicy);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setGlobalError = useUiStore((state) => state.setGlobalError);
  const clearGlobalError = useUiStore((state) => state.clearGlobalError);
  const [isIssuingPolicy, setIsIssuingPolicy] = useState(false);

  const issuePolicy = async (quoteId: string) => {
    setIsIssuingPolicy(true);
    clearGlobalError();

    try {
      const policy = await services.issuePolicy.execute({ quoteId });
      setPolicy(policy);
      return policy;
    } catch (error) {
      const mappedError = normalizeApiError(error);

      if (mappedError.status === 401 || mappedError.status === 403) {
        clearSession();
      }

      if (mappedError.status === 409) {
        const conflictError = new AppApiError({
          status: 409,
          globalMessage: 'Ya existe una póliza emitida para esta cotización.',
          fieldErrors: {},
        });
        setGlobalError(conflictError.message);
        throw conflictError;
      }

      setGlobalError(mappedError.message);
      throw mappedError;
    } finally {
      setIsIssuingPolicy(false);
    }
  };

  return {
    isIssuingPolicy,
    issuePolicy,
  };
}
