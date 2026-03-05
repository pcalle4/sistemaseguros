import { Inject, Injectable } from '@nestjs/common';
import { CATALOGS_REPOSITORY, CatalogItem, CatalogsRepository } from '../../domain/ports/catalogs.repository';

@Injectable()
export class ListLocationsUseCase {
  constructor(
    @Inject(CATALOGS_REPOSITORY)
    private readonly catalogsRepository: CatalogsRepository,
  ) {}

  async execute(): Promise<CatalogItem[]> {
    return this.catalogsRepository.listLocations();
  }
}
