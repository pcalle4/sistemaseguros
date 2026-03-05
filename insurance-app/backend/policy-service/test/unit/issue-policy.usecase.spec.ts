import { describe, expect, it, vi } from 'vitest';
import { IssuePolicyUseCase } from '../../src/application/use-cases/issue-policy.usecase';
import { ConflictDomainException, ValidationDomainException } from '../../src/shared/errors/domain-exceptions';
import { PoliciesRepository } from '../../src/domain/ports/policies.repository';
import { QuoteReadClient } from '../../src/domain/ports/quote-read.client';
import { UuidGenerator } from '../../src/domain/ports/uuid.generator';
import { Clock } from '../../src/domain/ports/clock';

describe('IssuePolicyUseCase', () => {
  it('throws validation error when quote does not exist', async () => {
    const quoteReadClient: QuoteReadClient = {
      getQuoteById: vi.fn(async () => 'NOT_FOUND'),
    };

    const policiesRepository: PoliciesRepository = {
      create: vi.fn(),
      findById: vi.fn(),
    };

    const uuidGenerator: UuidGenerator = { generate: () => 'policy-id' };
    const clock: Clock = { now: () => new Date('2026-03-05T00:00:00.000Z') };

    const useCase = new IssuePolicyUseCase(quoteReadClient, uuidGenerator, clock, policiesRepository);

    await expect(
      useCase.execute({ quoteId: '8b2a9b7f-e0b0-4a7f-9bf1-066f6db53553' }),
    ).rejects.toBeInstanceOf(ValidationDomainException);

    await expect(
      useCase.execute({ quoteId: '8b2a9b7f-e0b0-4a7f-9bf1-066f6db53553' }),
    ).rejects.toMatchObject({
      status: 400,
      errors: [{ field: 'quoteId', message: 'must reference an existing quote' }],
    });
  });

  it('creates policy when quote exists', async () => {
    const issuedAt = new Date('2026-03-05T00:00:00.000Z');

    const quoteReadClient: QuoteReadClient = {
      getQuoteById: vi.fn(async () => 'FOUND'),
    };

    const policiesRepository: PoliciesRepository = {
      create: vi.fn(async (input) => ({
        id: input.id,
        quoteId: input.quoteId,
        status: input.status,
        issuedAt: input.issuedAt,
      })),
      findById: vi.fn(),
    };

    const uuidGenerator: UuidGenerator = { generate: () => 'd8f825db-24d7-4f0c-986d-f1d8f6140f71' };
    const clock: Clock = { now: () => issuedAt };

    const useCase = new IssuePolicyUseCase(quoteReadClient, uuidGenerator, clock, policiesRepository);

    const result = await useCase.execute({ quoteId: '8b2a9b7f-e0b0-4a7f-9bf1-066f6db53553' });

    expect(result).toEqual({
      id: 'd8f825db-24d7-4f0c-986d-f1d8f6140f71',
      quoteId: '8b2a9b7f-e0b0-4a7f-9bf1-066f6db53553',
      status: 'ACTIVE',
      issuedAt,
    });
  });

  it('rethrows conflict when policy already exists', async () => {
    const quoteReadClient: QuoteReadClient = {
      getQuoteById: vi.fn(async () => 'FOUND'),
    };

    const policiesRepository: PoliciesRepository = {
      create: vi.fn(async () => {
        throw new ConflictDomainException('Policy already issued for quote');
      }),
      findById: vi.fn(),
    };

    const uuidGenerator: UuidGenerator = { generate: () => 'policy-id' };
    const clock: Clock = { now: () => new Date('2026-03-05T00:00:00.000Z') };

    const useCase = new IssuePolicyUseCase(quoteReadClient, uuidGenerator, clock, policiesRepository);

    await expect(
      useCase.execute({ quoteId: '8b2a9b7f-e0b0-4a7f-9bf1-066f6db53553' }),
    ).rejects.toBeInstanceOf(ConflictDomainException);
  });
});
