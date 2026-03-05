import { ApiProperty } from '@nestjs/swagger';

export class CatalogItemDto {
  @ApiProperty({ example: 'AUTO' })
  code!: string;

  @ApiProperty({ example: 'Seguro de Auto' })
  name!: string;
}

export class CatalogItemsResponseDto {
  @ApiProperty({ type: [CatalogItemDto] })
  items!: CatalogItemDto[];
}
