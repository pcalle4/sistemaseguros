export type QuoteLookupResult = 'FOUND' | 'NOT_FOUND';

export interface QuoteReadClient {
  getQuoteById(id: string): Promise<QuoteLookupResult>;
}

export const QUOTE_READ_CLIENT = 'QUOTE_READ_CLIENT';
