import { ApiProperty } from '@nestjs/swagger';

export class PolicyResponseDto {
  @ApiProperty({ example: 'd4d2ac7f-1100-44b6-87af-f1c37dfd3282' })
  id!: string;

  @ApiProperty({ example: '2eb8dbad-8adb-427f-b513-7d4c72217f8c' })
  quoteId!: string;

  @ApiProperty({ example: 'ACTIVE' })
  status!: string;

  @ApiProperty({ example: '2026-03-05T22:00:00.000Z' })
  issuedAt!: string;
}
