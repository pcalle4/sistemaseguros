import { ApiProperty } from '@nestjs/swagger';

export class ProblemFieldError {
  @ApiProperty({ example: 'email' })
  field!: string;

  @ApiProperty({ example: 'email must be an email' })
  message!: string;
}

export class ProblemDetails {
  @ApiProperty({ example: 'https://httpstatuses.com/401' })
  type!: string;

  @ApiProperty({ example: 'Unauthorized' })
  title!: string;

  @ApiProperty({ example: 401 })
  status!: number;

  @ApiProperty({ example: 'Missing or invalid bearer token' })
  detail!: string;

  @ApiProperty({ example: '/policies' })
  instance!: string;

  @ApiProperty({ type: [ProblemFieldError] })
  errors!: ProblemFieldError[];

  @ApiProperty({ example: 'f86a7d47-2107-4b18-b14e-99c9afb8b380' })
  traceId!: string;
}

export type ProblemFieldErrorItem = {
  field: string;
  message: string;
};
