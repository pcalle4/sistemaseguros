import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'api-gateway' })
  service!: string;

  @ApiProperty({ example: 'ok' })
  status!: string;

  @ApiProperty({ example: '2026-03-09T15:00:00.000Z' })
  timestamp!: string;
}
