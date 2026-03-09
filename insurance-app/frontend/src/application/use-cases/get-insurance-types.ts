import type { CatalogItems } from '../../domain/entities/catalog';
import type { CatalogsRepository } from '../../domain/repositories/catalogs.repository';

export class GetInsuranceTypesUseCase {
  constructor(private readonly repository: CatalogsRepository) {}

  execute(): Promise<CatalogItems> {
    return this.repository.getInsuranceTypes();
  }
}
