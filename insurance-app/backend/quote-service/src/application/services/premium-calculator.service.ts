import { Injectable } from '@nestjs/common';
import { BreakdownItem } from '../../domain/entities/breakdown-item';
import { ValidationDomainException } from '../../shared/errors/domain-exceptions';

type PremiumInput = {
  insuranceType: string;
  coverage: string;
  age: number;
  location: string;
};

type PremiumResult = {
  estimatedPremium: number;
  breakdown: BreakdownItem[];
};

const BASE_BY_INSURANCE_TYPE: Record<string, number> = {
  AUTO: 200,
  SALUD: 250,
  HOGAR: 180,
};

const LOCATION_FACTOR: Record<string, number> = {
  'EC-AZUAY': 40,
  'EC-GUAYAS': 60,
  'EC-PICHINCHA': 70,
};

const COVERAGE_FACTOR: Record<string, number> = {
  BASICA: 20,
  ESTANDAR: 35,
  PREMIUM: 50,
};

@Injectable()
export class PremiumCalculatorService {
  calculate(input: PremiumInput): PremiumResult {
    const base = BASE_BY_INSURANCE_TYPE[input.insuranceType];
    const locationFactor = LOCATION_FACTOR[input.location];
    const coverageFactor = COVERAGE_FACTOR[input.coverage];

    if (base === undefined || locationFactor === undefined || coverageFactor === undefined) {
      throw new ValidationDomainException('Validation failed', [
        { field: 'inputs', message: 'cannot calculate premium for provided values' },
      ]);
    }

    const ageFactor = this.calculateAgeFactor(input.age);
    const breakdown: BreakdownItem[] = [
      { concept: 'BASE', amount: base },
      { concept: 'AGE_FACTOR', amount: ageFactor },
      { concept: 'LOCATION_FACTOR', amount: locationFactor },
      { concept: 'COVERAGE_FACTOR', amount: coverageFactor },
    ];

    const estimatedPremium = breakdown.reduce((acc, item) => acc + item.amount, 0);

    return {
      estimatedPremium,
      breakdown,
    };
  }

  private calculateAgeFactor(age: number): number {
    if (age < 25) {
      return 80;
    }

    if (age <= 40) {
      return 60;
    }

    return 40;
  }
}
