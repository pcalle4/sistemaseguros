import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateQuoteDto {
  @ApiProperty({ example: 'AUTO' })
  @IsString()
  @IsNotEmpty()
  insuranceType!: string;

  @ApiProperty({ example: 'PREMIUM' })
  @IsString()
  @IsNotEmpty()
  coverage!: string;

  @ApiProperty({ example: 35, minimum: 18, maximum: 100 })
  @IsInt()
  @Min(18)
  @Max(100)
  age!: number;

  @ApiProperty({ example: 'EC-AZUAY' })
  @IsString()
  @IsNotEmpty()
  location!: string;
}
