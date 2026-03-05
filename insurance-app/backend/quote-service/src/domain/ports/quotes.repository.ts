import { BreakdownItem } from '../entities/breakdown-item';
import { Quote, QuoteStatus } from '../entities/quote';

export type CreateQuoteRecordInput = {
  id: string;
  status: QuoteStatus;
  insuranceType: string;
  coverage: string;
  age: number;
  location: string;
  estimatedPremium: number;
  breakdown: BreakdownItem[];
  createdAt: Date;
};

export interface QuotesRepository {
  create(input: CreateQuoteRecordInput): Promise<Quote>;
  findById(id: string): Promise<Quote | null>;
}

export const QUOTES_REPOSITORY = Symbol('QUOTES_REPOSITORY');
