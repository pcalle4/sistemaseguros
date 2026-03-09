import type { CatalogItems } from '../../domain/entities/catalog';
import type { CatalogsRepository } from '../../domain/repositories/catalogs.repository';

export class GetCoveragesUseCase {
  constructor(private readonly repository: CatalogsRepository) {}

  execute(insuranceType: string): Promise<CatalogItems> {
    return this.repository.getCoverages(insuranceType);
  }
}
