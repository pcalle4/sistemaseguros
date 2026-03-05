import { Inject, Injectable } from '@nestjs/common';
import { CATALOGS_REPOSITORY, CatalogItem, CatalogsRepository } from '../../domain/ports/catalogs.repository';
import { ValidationDomainException } from '../../shared/errors/domain-exceptions';

@Injectable()
export class ListCoveragesUseCase {
  constructor(
    @Inject(CATALOGS_REPOSITORY)
    private readonly catalogsRepository: CatalogsRepository,
  ) {}

  async execute(insuranceType: string): Promise<CatalogItem[]> {
    const insuranceTypeExists = await this.catalogsRepository.existsInsuranceType(insuranceType);

    if (!insuranceTypeExists) {
      throw new ValidationDomainException('Validation failed', [
        { field: 'insuranceType', message: 'must be a valid catalog value' },
      ]);
    }

    return this.catalogsRepository.listCoveragesByInsuranceType(insuranceType);
  }
}
