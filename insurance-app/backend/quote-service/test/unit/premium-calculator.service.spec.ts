import { describe, expect, it } from 'vitest';
import { PremiumCalculatorService } from '../../src/application/services/premium-calculator.service';

describe('PremiumCalculatorService', () => {
  const calculator = new PremiumCalculatorService();

  it('calculates Formula A for AUTO + PREMIUM + age 35 + EC-AZUAY', () => {
    const result = calculator.calculate({
      insuranceType: 'AUTO',
      coverage: 'PREMIUM',
      age: 35,
      location: 'EC-AZUAY',
    });

    expect(result.breakdown).toEqual([
      { concept: 'BASE', amount: 200 },
      { concept: 'AGE_FACTOR', amount: 60 },
      { concept: 'LOCATION_FACTOR', amount: 40 },
      { concept: 'COVERAGE_FACTOR', amount: 50 },
    ]);
    expect(result.estimatedPremium).toBe(350);
  });

  it('applies age factor for younger than 25', () => {
    const result = calculator.calculate({
      insuranceType: 'HOGAR',
      coverage: 'BASICA',
      age: 22,
      location: 'EC-GUAYAS',
    });

    expect(result.breakdown.find((item) => item.concept === 'AGE_FACTOR')?.amount).toBe(80);
    expect(result.estimatedPremium).toBe(340);
  });
});
