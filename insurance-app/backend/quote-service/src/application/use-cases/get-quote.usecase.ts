import { Inject, Injectable } from '@nestjs/common';
import { Quote } from '../../domain/entities/quote';
import { QUOTES_REPOSITORY, QuotesRepository } from '../../domain/ports/quotes.repository';
import { NotFoundDomainException } from '../../shared/errors/domain-exceptions';

@Injectable()
export class GetQuoteUseCase {
  constructor(
    @Inject(QUOTES_REPOSITORY)
    private readonly quotesRepository: QuotesRepository,
  ) {}

  async execute(id: string): Promise<Quote> {
    const quote = await this.quotesRepository.findById(id);

    if (!quote) {
      throw new NotFoundDomainException('Quote not found');
    }

    return quote;
  }
}
