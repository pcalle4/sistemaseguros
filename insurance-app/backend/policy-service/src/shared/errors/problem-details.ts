import { ApiProperty } from '@nestjs/swagger';

export class ProblemFieldErrorDto {
  @ApiProperty({ example: 'quoteId' })
  field!: string;

  @ApiProperty({ example: 'must reference an existing quote' })
  message!: string;
}

export class ProblemDetailsDto {
  @ApiProperty({ example: 'https://httpstatuses.com/400' })
  type!: string;

  @ApiProperty({ example: 'Bad Request' })
  title!: string;

  @ApiProperty({ example: 400 })
  status!: number;

  @ApiProperty({ example: 'Validation failed' })
  detail!: string;

  @ApiProperty({ example: '/policies' })
  instance!: string;

  @ApiProperty({ type: [ProblemFieldErrorDto] })
  errors!: ProblemFieldErrorDto[];

  @ApiProperty({ example: '08e86f0f-f8b9-4ccb-b4ca-b546af0f0f9f' })
  traceId!: string;
}

export type ProblemFieldError = {
  field: string;
  message: string;
};

export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors: ProblemFieldError[];
  traceId: string;
};
