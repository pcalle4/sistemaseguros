import { useState } from 'react';
import { normalizeApiError } from '../../core/utils/error-mapper';
import type { QuoteFormValues } from '../../domain/value-objects/quote-form';
import { services } from '../../infrastructure/container/services';
import { useQuoteStore } from '../store/quote.store';
import { useUiStore } from '../store/ui.store';

export function useQuoteFlow() {
  const setQuote = useQuoteStore((state) => state.setQuote);
  const clearPolicy = useQuoteStore((state) => state.clearPolicy);
  const setGlobalError = useUiStore((state) => state.setGlobalError);
  const clearGlobalError = useUiStore((state) => state.clearGlobalError);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  const submitQuote = async (values: QuoteFormValues) => {
    setIsSubmittingQuote(true);
    clearGlobalError();

    try {
      const quote = await services.createQuote.execute(values);
      setQuote(quote);
      clearPolicy();
      return quote;
    } catch (error) {
      const mappedError = normalizeApiError(error);
      setGlobalError(mappedError.message);
      throw mappedError;
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  return {
    isSubmittingQuote,
    submitQuote,
  };
}
