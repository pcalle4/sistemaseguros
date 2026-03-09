import type { AxiosInstance } from 'axios';
import { apiRoutes } from '../../core/constants/routes';
import type { CatalogItemsApiResponse } from '../../core/types/api';
import type { CatalogItems } from '../../domain/entities/catalog';
import type { CatalogsRepository } from '../../domain/repositories/catalogs.repository';

export class CatalogsApiRepository implements CatalogsRepository {
  constructor(private readonly client: AxiosInstance) {}

  async getInsuranceTypes(): Promise<CatalogItems> {
    const response = await this.client.get<CatalogItemsApiResponse>(apiRoutes.catalogs.insuranceTypes);
    return { items: response.data.items };
  }

  async getCoverages(insuranceType: string): Promise<CatalogItems> {
    const response = await this.client.get<CatalogItemsApiResponse>(apiRoutes.catalogs.coverages, {
      params: { insuranceType },
    });
    return { items: response.data.items };
  }

  async getLocations(): Promise<CatalogItems> {
    const response = await this.client.get<CatalogItemsApiResponse>(apiRoutes.catalogs.locations);
    return { items: response.data.items };
  }
}
