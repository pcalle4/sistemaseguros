import { ApiProperty } from '@nestjs/swagger';
import { Quote } from '../../domain/entities/quote';

export class QuoteInputDto {
  @ApiProperty({ example: 'AUTO' })
  insuranceType!: string;

  @ApiProperty({ example: 'PREMIUM' })
  coverage!: string;

  @ApiProperty({ example: 35 })
  age!: number;

  @ApiProperty({ example: 'EC-AZUAY' })
  location!: string;
}

export class QuoteBreakdownItemDto {
  @ApiProperty({ example: 'BASE' })
  concept!: string;

  @ApiProperty({ example: 200 })
  amount!: number;
}

export class QuoteResponseDto {
  @ApiProperty({ example: '97e6fc4d-8f0e-458a-8010-bcbcf70d87e7' })
  id!: string;

  @ApiProperty({ example: 'QUOTED' })
  status!: string;

  @ApiProperty({ type: QuoteInputDto })
  inputs!: QuoteInputDto;

  @ApiProperty({ example: 350 })
  estimatedPremium!: number;

  @ApiProperty({ type: [QuoteBreakdownItemDto] })
  breakdown!: QuoteBreakdownItemDto[];

  @ApiProperty({ example: '2026-03-05T22:40:00.000Z' })
  createdAt!: string;
}

export function toQuoteResponseDto(quote: Quote): QuoteResponseDto {
  return {
    id: quote.id,
    status: quote.status,
    inputs: {
      insuranceType: quote.inputs.insuranceType,
      coverage: quote.inputs.coverage,
      age: quote.inputs.age,
      location: quote.inputs.location,
    },
    estimatedPremium: quote.estimatedPremium,
    breakdown: quote.breakdown.map((item) => ({
      concept: item.concept,
      amount: item.amount,
    })),
    createdAt: quote.createdAt.toISOString(),
  };
}
