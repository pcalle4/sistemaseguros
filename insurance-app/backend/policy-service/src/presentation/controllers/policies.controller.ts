import {
  Body,
  Controller,
  Get,
  HttpCode,
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
import { ProblemDetailsDto } from '../../shared/errors/problem-details';

@ApiTags('Policies')
@Controller('policies')
export class PoliciesController {
  constructor(
    @Inject(IssuePolicyUseCase)
    private readonly issuePolicyUseCase: IssuePolicyUseCase,
    @Inject(GetPolicyUseCase)
    private readonly getPolicyUseCase: GetPolicyUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Issue policy from a quote' })
  @ApiCreatedResponse({ type: PolicyResponseDto })
  @ApiBadRequestResponse({ type: ProblemDetailsDto })
  @ApiConflictResponse({ type: ProblemDetailsDto })
  @ApiBadGatewayResponse({ type: ProblemDetailsDto })
  async create(@Body() dto: CreatePolicyDto): Promise<PolicyResponseDto> {
    const policy = await this.issuePolicyUseCase.execute(dto);
    return toPolicyResponseDto(policy);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get policy by id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: PolicyResponseDto })
  @ApiNotFoundResponse({ type: ProblemDetailsDto })
  @ApiBadRequestResponse({ type: ProblemDetailsDto })
  async getById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<PolicyResponseDto> {
    const policy = await this.getPolicyUseCase.execute(id);
    return toPolicyResponseDto(policy);
  }
}
