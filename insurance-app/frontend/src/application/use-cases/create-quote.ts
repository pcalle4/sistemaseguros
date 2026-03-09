import type { Quote } from '../../domain/entities/quote';
import type { QuotesRepository } from '../../domain/repositories/quotes.repository';

export class CreateQuoteUseCase {
  constructor(private readonly repository: QuotesRepository) {}

  execute(payload: {
    insuranceType: string;
    coverage: string;
    age: number;
    location: string;
  }): Promise<Quote> {
    return this.repository.createQuote(payload);
  }
}
