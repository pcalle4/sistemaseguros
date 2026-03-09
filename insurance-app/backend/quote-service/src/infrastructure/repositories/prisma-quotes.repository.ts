import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BreakdownItem } from '../../domain/entities/breakdown-item';
import { Quote } from '../../domain/entities/quote';
import { CreateQuoteRecordInput, QuotesRepository } from '../../domain/ports/quotes.repository';
import { PrismaService } from '../prisma/prisma.service';

const BREAKDOWN_ORDER: Record<string, number> = {
  BASE: 0,
  AGE_FACTOR: 1,
  LOCATION_FACTOR: 2,
  COVERAGE_FACTOR: 3,
};

@Injectable()
export class PrismaQuotesRepository implements QuotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateQuoteRecordInput): Promise<Quote> {
    const quote = await this.prisma.quote.create({
      data: {
        id: input.id,
        status: input.status,
        insuranceType: input.insuranceType,
        coverage: input.coverage,
        age: input.age,
        location: input.location,
        estimatedPremium: input.estimatedPremium,
        createdAt: input.createdAt,
        breakdownItems: {
          create: input.breakdown.map((item) => ({
            id: randomUUID(),
            concept: item.concept,
            amount: item.amount,
          })),
        },
      },
      include: {
        breakdownItems: true,
      },
    });

    return this.toDomain(quote);
  }

  async findById(id: string): Promise<Quote | null> {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: {
        breakdownItems: true,
      },
    });

    if (!quote) {
      return null;
    }

    return this.toDomain(quote);
  }

  private toDomain(quote: {
    id: string;
    status: string;
    insuranceType: string;
    coverage: string;
    age: number;
    location: string;
    estimatedPremium: number;
    createdAt: Date;
    breakdownItems: { concept: string; amount: number }[];
  }): Quote {
    const breakdown = quote.breakdownItems
      .map(
        (item): BreakdownItem => ({
          concept: item.concept as BreakdownItem['concept'],
          amount: item.amount,
        }),
      )
      .sort((a, b) => BREAKDOWN_ORDER[a.concept] - BREAKDOWN_ORDER[b.concept]);

    return {
      id: quote.id,
      status: quote.status as Quote['status'],
      inputs: {
        insuranceType: quote.insuranceType,
        coverage: quote.coverage,
        age: quote.age,
        location: quote.location,
      },
      estimatedPremium: quote.estimatedPremium,
      breakdown,
      createdAt: quote.createdAt,
    };
  }
}
