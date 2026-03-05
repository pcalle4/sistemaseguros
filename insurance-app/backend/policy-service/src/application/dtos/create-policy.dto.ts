import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePolicyDto {
  @ApiProperty({ example: '2eb8dbad-8adb-427f-b513-7d4c72217f8c' })
  @IsUUID('4')
  @IsNotEmpty()
  quoteId!: string;
}
