import type { CatalogItems } from '../entities/catalog';

export interface CatalogsRepository {
  getInsuranceTypes(): Promise<CatalogItems>;
  getCoverages(insuranceType: string): Promise<CatalogItems>;
  getLocations(): Promise<CatalogItems>;
}
