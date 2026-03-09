import type { AxiosInstance } from 'axios';
import { apiRoutes } from '../../core/constants/routes';
import type { CreateQuoteApiRequest, QuoteApiResponse } from '../../core/types/api';
import type { Quote } from '../../domain/entities/quote';
import type { QuotesRepository } from '../../domain/repositories/quotes.repository';

function toQuote(data: QuoteApiResponse): Quote {
  return {
    id: data.id,
    status: data.status,
    inputs: data.inputs,
    estimatedPremium: data.estimatedPremium,
    breakdown: data.breakdown,
    createdAt: data.createdAt,
  };
}

export class QuotesApiRepository implements QuotesRepository {
  constructor(private readonly client: AxiosInstance) {}

  async createQuote(payload: CreateQuoteApiRequest): Promise<Quote> {
    const response = await this.client.post<QuoteApiResponse>(apiRoutes.quotes, payload);
    return toQuote(response.data);
  }

  async getQuoteById(quoteId: string): Promise<Quote> {
    const response = await this.client.get<QuoteApiResponse>(apiRoutes.quoteById(quoteId));
    return toQuote(response.data);
  }
}
