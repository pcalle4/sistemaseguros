import { Inject, Injectable } from '@nestjs/common';
import { CatalogItemsResponseDto } from '../dtos/catalog-item.dto';
import { ListCoveragesQueryDto } from '../dtos/list-coverages-query.dto';
import {
  UPSTREAM_GATEWAY_CLIENT,
  UpstreamGatewayClient,
} from '../../domain/ports/upstream-gateway.client';
import { normalizeUpstreamError } from '../../shared/errors/normalize-upstream-error';

@Injectable()
export class ProxyCatalogsUseCase {
  constructor(
    @Inject(UPSTREAM_GATEWAY_CLIENT)
    private readonly upstreamGatewayClient: UpstreamGatewayClient,
  ) {}

  async listInsuranceTypes(): Promise<CatalogItemsResponseDto> {
    try {
      const response = await this.upstreamGatewayClient.get<CatalogItemsResponseDto>({
        service: 'quote-service',
        path: '/catalogs/insurance-types',
      });

      return response.data;
    } catch (error) {
      normalizeUpstreamError(error);
    }
  }

  async listCoverages(query: ListCoveragesQueryDto): Promise<CatalogItemsResponseDto> {
    try {
      const response = await this.upstreamGatewayClient.get<CatalogItemsResponseDto>({
        service: 'quote-service',
        path: '/catalogs/coverages',
        query: {
          insuranceType: query.insuranceType,
        },
      });

      return response.data;
    } catch (error) {
      normalizeUpstreamError(error);
    }
  }

  async listLocations(): Promise<CatalogItemsResponseDto> {
    try {
      const response = await this.upstreamGatewayClient.get<CatalogItemsResponseDto>({
        service: 'quote-service',
        path: '/catalogs/locations',
      });

      return response.data;
    } catch (error) {
      normalizeUpstreamError(error);
    }
  }
}
