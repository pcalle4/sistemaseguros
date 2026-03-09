import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CatalogItemsResponseDto } from '../../application/dtos/catalog-item.dto';
import { ListCoveragesQueryDto } from '../../application/dtos/list-coverages-query.dto';
import { ProxyCatalogsUseCase } from '../../application/use-cases/proxy-catalogs.usecase';
import { ProblemDetails } from '../../shared/errors/problem-details';

@ApiTags('Catalogs')
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly proxyCatalogsUseCase: ProxyCatalogsUseCase) {}

  @Get('insurance-types')
  @ApiOperation({ summary: 'List available insurance types' })
  @ApiOkResponse({ type: CatalogItemsResponseDto })
  @ApiBadGatewayResponse({ type: ProblemDetails })
  listInsuranceTypes(): Promise<CatalogItemsResponseDto> {
    return this.proxyCatalogsUseCase.listInsuranceTypes();
  }

  @Get('coverages')
  @ApiOperation({ summary: 'List coverages by insurance type' })
  @ApiQuery({ name: 'insuranceType', required: true, example: 'AUTO' })
  @ApiOkResponse({ type: CatalogItemsResponseDto })
  @ApiBadGatewayResponse({ type: ProblemDetails })
  listCoverages(@Query() query: ListCoveragesQueryDto): Promise<CatalogItemsResponseDto> {
    return this.proxyCatalogsUseCase.listCoverages(query);
  }

  @Get('locations')
  @ApiOperation({ summary: 'List available locations' })
  @ApiOkResponse({ type: CatalogItemsResponseDto })
  @ApiBadGatewayResponse({ type: ProblemDetails })
  listLocations(): Promise<CatalogItemsResponseDto> {
    return this.proxyCatalogsUseCase.listLocations();
  }
}
