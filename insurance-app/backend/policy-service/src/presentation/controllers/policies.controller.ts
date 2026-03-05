import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePolicyDto } from '../../application/dtos/create-policy.dto';
import { PolicyResponseDto, toPolicyResponseDto } from '../../application/dtos/policy-response.dto';
import { GetPolicyUseCase } from '../../application/use-cases/get-policy.usecase';
import { IssuePolicyUseCase } from '../../application/use-cases/issue-policy.usecase';
import { DomainException } from '../../shared/errors/domain-exceptions';
import { ProblemDetailsDto } from '../../shared/errors/problem-details';
import { AppLogger } from '../../shared/logging/logger';

@ApiTags('Policies')
@Controller('policies')
export class PoliciesController {
  constructor(
    @Inject(IssuePolicyUseCase)
    private readonly issuePolicyUseCase: IssuePolicyUseCase,
    @Inject(GetPolicyUseCase)
    private readonly getPolicyUseCase: GetPolicyUseCase,
    @Inject(AppLogger)
    private readonly logger: AppLogger,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Issue policy from a quote' })
  @ApiCreatedResponse({ type: PolicyResponseDto })
  @ApiBadRequestResponse({ type: ProblemDetailsDto })
  @ApiConflictResponse({ type: ProblemDetailsDto })
  @ApiBadGatewayResponse({ type: ProblemDetailsDto })
  async create(@Body() dto: CreatePolicyDto): Promise<PolicyResponseDto> {
    try {
      const policy = await this.issuePolicyUseCase.execute(dto);
      this.logger.logRequest({ method: 'POST', path: '/policies', status: 201 });
      return toPolicyResponseDto(policy);
    } catch (error) {
      this.logErrorStatus('POST', '/policies', error);
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get policy by id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: PolicyResponseDto })
  @ApiNotFoundResponse({ type: ProblemDetailsDto })
  @ApiBadRequestResponse({ type: ProblemDetailsDto })
  async getById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<PolicyResponseDto> {
    try {
      const policy = await this.getPolicyUseCase.execute(id);
      this.logger.logRequest({ method: 'GET', path: '/policies/:id', status: 200 });
      return toPolicyResponseDto(policy);
    } catch (error) {
      this.logErrorStatus('GET', '/policies/:id', error);
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
