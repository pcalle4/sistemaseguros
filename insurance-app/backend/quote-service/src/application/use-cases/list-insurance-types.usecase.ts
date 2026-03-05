import { Inject, Injectable } from '@nestjs/common';
import { CATALOGS_REPOSITORY, CatalogItem, CatalogsRepository } from '../../domain/ports/catalogs.repository';

const INSURANCE_TYPE_ORDER: Record<string, number> = {
  AUTO: 0,
  SALUD: 1,
  HOGAR: 2,
};

@Injectable()
export class ListInsuranceTypesUseCase {
  constructor(
    @Inject(CATALOGS_REPOSITORY)
    private readonly catalogsRepository: CatalogsRepository,
  ) {}

  async execute(): Promise<CatalogItem[]> {
    const items = await this.catalogsRepository.listInsuranceTypes();

    return items.sort((a, b) => {
      const left = INSURANCE_TYPE_ORDER[a.code] ?? Number.MAX_SAFE_INTEGER;
      const right = INSURANCE_TYPE_ORDER[b.code] ?? Number.MAX_SAFE_INTEGER;
      return left - right;
    });
  }
}
