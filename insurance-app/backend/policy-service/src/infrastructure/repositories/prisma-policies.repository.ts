import { Prisma } from '@insurance/policy-prisma-client';
import { Inject, Injectable } from '@nestjs/common';
import { Policy } from '../../domain/entities/policy';
import { CreatePolicyInput, PoliciesRepository } from '../../domain/ports/policies.repository';
import { ConflictDomainException } from '../../shared/errors/domain-exceptions';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaPoliciesRepository implements PoliciesRepository {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async create(input: CreatePolicyInput): Promise<Policy> {
    try {
      const policy = await this.prisma.policy.create({
        data: {
          id: input.id,
          quoteId: input.quoteId,
          status: input.status,
          issuedAt: input.issuedAt,
        },
      });

      return {
        id: policy.id,
        quoteId: policy.quoteId,
        status: policy.status,
        issuedAt: policy.issuedAt,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes('quote_id')
      ) {
        throw new ConflictDomainException('Policy already issued for quote');
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictDomainException('Policy already issued for quote');
      }

      throw error;
    }
  }

  async findById(id: string): Promise<Policy | null> {
    const policy = await this.prisma.policy.findUnique({
      where: { id },
    });

    if (!policy) {
      return null;
    }

    return {
      id: policy.id,
      quoteId: policy.quoteId,
      status: policy.status,
      issuedAt: policy.issuedAt,
    };
  }
}
