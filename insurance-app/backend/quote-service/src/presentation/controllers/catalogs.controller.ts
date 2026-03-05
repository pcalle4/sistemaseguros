import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ListCoveragesQueryDto } from '../../application/dtos/list-coverages-query.dto';
import { CatalogItemsResponseDto } from '../../application/dtos/catalog-item.dto';
import { ListInsuranceTypesUseCase } from '../../application/use-cases/list-insurance-types.usecase';
import { ListCoveragesUseCase } from '../../application/use-cases/list-coverages.usecase';
import { ListLocationsUseCase } from '../../application/use-cases/list-locations.usecase';
import { DomainException } from '../../shared/errors/domain-exceptions';
import { AppLogger } from '../../shared/logging/logger';

@ApiTags('Catalogs')
@Controller('catalogs')
export class CatalogsController {
  constructor(
    private readonly listInsuranceTypesUseCase: ListInsuranceTypesUseCase,
    private readonly listCoveragesUseCase: ListCoveragesUseCase,
    private readonly listLocationsUseCase: ListLocationsUseCase,
    private readonly logger: AppLogger,
  ) {}

  @Get('insurance-types')
  @ApiOperation({ summary: 'List insurance types' })
  @ApiOkResponse({ type: CatalogItemsResponseDto })
  async listInsuranceTypes(): Promise<CatalogItemsResponseDto> {
    try {
      const items = await this.listInsuranceTypesUseCase.execute();
      this.logger.logRequest({ method: 'GET', path: '/catalogs/insurance-types', status: 200 });
      return { items };
    } catch (error) {
      this.logErrorStatus('GET', '/catalogs/insurance-types', error);
      throw error;
    }
  }

  @Get('coverages')
  @ApiOperation({ summary: 'List coverages by insurance type' })
  @ApiQuery({ name: 'insuranceType', required: true })
  @ApiOkResponse({ type: CatalogItemsResponseDto })
  async listCoverages(@Query() query: ListCoveragesQueryDto): Promise<CatalogItemsResponseDto> {
    try {
      const items = await this.listCoveragesUseCase.execute(query.insuranceType);
      this.logger.logRequest({ method: 'GET', path: '/catalogs/coverages', status: 200 });
      return { items };
    } catch (error) {
      this.logErrorStatus('GET', '/catalogs/coverages', error);
      throw error;
    }
  }

  @Get('locations')
  @ApiOperation({ summary: 'List locations' })
  @ApiOkResponse({ type: CatalogItemsResponseDto })
  async listLocations(): Promise<CatalogItemsResponseDto> {
    try {
      const items = await this.listLocationsUseCase.execute();
      this.logger.logRequest({ method: 'GET', path: '/catalogs/locations', status: 200 });
      return { items };
    } catch (error) {
      this.logErrorStatus('GET', '/catalogs/locations', error);
      throw error;
    }
  }

  private logErrorStatus(method: string, path: string, error: unknown): void {
    const status =
      error instanceof DomainException
        ? error.status
        : error instanceof HttpException
          ? error.getStatus()
          : 500;

    this.logger.logRequest({ method, path, status });
  }
}
