import type { Quote } from '../entities/quote';

export interface QuotesRepository {
  createQuote(payload: {
    insuranceType: string;
    coverage: string;
    age: number;
    location: string;
  }): Promise<Quote>;
  getQuoteById(quoteId: string): Promise<Quote>;
}
