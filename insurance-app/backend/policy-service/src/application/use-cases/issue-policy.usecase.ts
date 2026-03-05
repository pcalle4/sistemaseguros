import { Inject, Injectable } from '@nestjs/common';
import { CLOCK, Clock } from '../../domain/ports/clock';
import { POLICIES_REPOSITORY, PoliciesRepository } from '../../domain/ports/policies.repository';
import { QUOTE_READ_CLIENT, QuoteReadClient } from '../../domain/ports/quote-read.client';
import { UUID_GENERATOR, UuidGenerator } from '../../domain/ports/uuid.generator';
import { ConflictDomainException, ValidationDomainException } from '../../shared/errors/domain-exceptions';
import { CreatePolicyDto } from '../dtos/create-policy.dto';

@Injectable()
export class IssuePolicyUseCase {
  constructor(
    @Inject(QUOTE_READ_CLIENT)
    private readonly quoteReadClient: QuoteReadClient,
    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: UuidGenerator,
    @Inject(CLOCK)
    private readonly clock: Clock,
    @Inject(POLICIES_REPOSITORY)
    private readonly policiesRepository: PoliciesRepository,
  ) {}

  async execute(dto: CreatePolicyDto) {
    const quoteResult = await this.quoteReadClient.getQuoteById(dto.quoteId);

    if (quoteResult === 'NOT_FOUND') {
      throw new ValidationDomainException('Validation failed', [
        { field: 'quoteId', message: 'must reference an existing quote' },
      ]);
    }

    try {
      return await this.policiesRepository.create({
        id: this.uuidGenerator.generate(),
        quoteId: dto.quoteId,
        status: 'ACTIVE',
        issuedAt: this.clock.now(),
      });
    } catch (error) {
      if (error instanceof ConflictDomainException) {
        throw error;
      }

      throw error;
    }
  }
}
