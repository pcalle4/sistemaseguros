import { Inject, Injectable } from '@nestjs/common';
import { CATALOGS_REPOSITORY, CatalogsRepository } from '../../domain/ports/catalogs.repository';
import { ValidationDomainException } from '../../shared/errors/domain-exceptions';

type QuoteCatalogInput = {
  insuranceType: string;
  coverage: string;
  location: string;
};

@Injectable()
export class CatalogsValidatorService {
  constructor(
    @Inject(CATALOGS_REPOSITORY)
    private readonly catalogsRepository: CatalogsRepository,
  ) {}

  async validateQuoteInput(input: QuoteCatalogInput): Promise<void> {
    const [insuranceTypeExists, locationExists, coverageAllowed] = await Promise.all([
      this.catalogsRepository.existsInsuranceType(input.insuranceType),
      this.catalogsRepository.existsLocation(input.location),
      this.catalogsRepository.existsCoverageForInsuranceType(input.insuranceType, input.coverage),
    ]);

    const errors: { field: string; message: string }[] = [];

    if (!insuranceTypeExists) {
      errors.push({
        field: 'insuranceType',
        message: 'must be a valid catalog value',
      });
    }

    if (!locationExists) {
      errors.push({
        field: 'location',
        message: 'must be a valid catalog value',
      });
    }

    if (insuranceTypeExists && !coverageAllowed) {
      errors.push({
        field: 'coverage',
        message: 'coverage not allowed for insuranceType',
      });
    }

    if (errors.length > 0) {
      throw new ValidationDomainException('Validation failed', errors);
    }
  }
}
