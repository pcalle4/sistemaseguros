import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ListCoveragesQueryDto } from '../../application/dtos/list-coverages-query.dto';
import { CatalogItemsResponseDto } from '../../application/dtos/catalog-item.dto';
import { ListInsuranceTypesUseCase } from '../../application/use-cases/list-insurance-types.usecase';
import { ListCoveragesUseCase } from '../../application/use-cases/list-coverages.usecase';
import { ListLocationsUseCase } from '../../application/use-cases/list-locations.usecase';

@ApiTags('Catalogs')
@Controller('catalogs')
export class CatalogsController {
  constructor(
    private readonly listInsuranceTypesUseCase: ListInsuranceTypesUseCase,
    private readonly listCoveragesUseCase: ListCoveragesUseCase,
    private readonly listLocationsUseCase: ListLocationsUseCase,
  ) {}

  @Get('insurance-types')
  @ApiOperation({ summary: 'List insurance types' })
  @ApiOkResponse({ type: CatalogItemsResponseDto })
  async listInsuranceTypes(): Promise<CatalogItemsResponseDto> {
    const items = await this.listInsuranceTypesUseCase.execute();
    return { items };
  }

  @Get('coverages')
  @ApiOperation({ summary: 'List coverages by insurance type' })
  @ApiQuery({ name: 'insuranceType', required: true })
  @ApiOkResponse({ type: CatalogItemsResponseDto })
  async listCoverages(@Query() query: ListCoveragesQueryDto): Promise<CatalogItemsResponseDto> {
    const items = await this.listCoveragesUseCase.execute(query.insuranceType);
    return { items };
  }

  @Get('locations')
  @ApiOperation({ summary: 'List locations' })
  @ApiOkResponse({ type: CatalogItemsResponseDto })
  async listLocations(): Promise<CatalogItemsResponseDto> {
    const items = await this.listLocationsUseCase.execute();
    return { items };
  }
}
