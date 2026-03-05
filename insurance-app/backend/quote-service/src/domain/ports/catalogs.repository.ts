export type CatalogItem = {
  code: string;
  name: string;
};

export interface CatalogsRepository {
  listInsuranceTypes(): Promise<CatalogItem[]>;
  listCoveragesByInsuranceType(insuranceTypeCode: string): Promise<CatalogItem[]>;
  listLocations(): Promise<CatalogItem[]>;
  existsInsuranceType(code: string): Promise<boolean>;
  existsCoverageForInsuranceType(insuranceTypeCode: string, coverageCode: string): Promise<boolean>;
  existsLocation(code: string): Promise<boolean>;
}

export const CATALOGS_REPOSITORY = Symbol('CATALOGS_REPOSITORY');
