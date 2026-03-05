import { Inject, Injectable } from '@nestjs/common';
import { CreateQuoteDto } from '../dtos/create-quote.dto';
import { PremiumCalculatorService } from '../services/premium-calculator.service';
import { CatalogsValidatorService } from '../services/catalogs-validator.service';
import { CLOCK, Clock } from '../../domain/ports/clock';
import { QUOTES_REPOSITORY, QuotesRepository } from '../../domain/ports/quotes.repository';
import { UUID_GENERATOR, UuidGenerator } from '../../domain/ports/uuid.generator';
import { Quote } from '../../domain/entities/quote';

@Injectable()
export class CreateQuoteUseCase {
  constructor(
    private readonly catalogsValidator: CatalogsValidatorService,
    private readonly premiumCalculatorService: PremiumCalculatorService,
    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: UuidGenerator,
    @Inject(CLOCK)
    private readonly clock: Clock,
    @Inject(QUOTES_REPOSITORY)
    private readonly quotesRepository: QuotesRepository,
  ) {}

  async execute(dto: CreateQuoteDto): Promise<Quote> {
    await this.catalogsValidator.validateQuoteInput({
      insuranceType: dto.insuranceType,
      coverage: dto.coverage,
      location: dto.location,
    });

    const premiumResult = this.premiumCalculatorService.calculate({
      insuranceType: dto.insuranceType,
      coverage: dto.coverage,
      age: dto.age,
      location: dto.location,
    });

    return this.quotesRepository.create({
      id: this.uuidGenerator.generate(),
      status: 'QUOTED',
      insuranceType: dto.insuranceType,
      coverage: dto.coverage,
      age: dto.age,
      location: dto.location,
      estimatedPremium: premiumResult.estimatedPremium,
      breakdown: premiumResult.breakdown,
      createdAt: this.clock.now(),
    });
  }
}
