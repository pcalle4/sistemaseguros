import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatePolicyDto } from '../../application/dtos/create-policy.dto';
import { PolicyResponseDto } from '../../application/dtos/policy-response.dto';
import { ProxyPoliciesUseCase } from '../../application/use-cases/proxy-policies.usecase';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { ProblemDetails } from '../../shared/errors/problem-details';

@ApiTags('Policies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('policies')
export class PoliciesController {
  constructor(private readonly proxyPoliciesUseCase: ProxyPoliciesUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a policy via policy-service' })
  @ApiCreatedResponse({ type: PolicyResponseDto })
  @ApiUnauthorizedResponse({ type: ProblemDetails })
  @ApiBadGatewayResponse({ type: ProblemDetails })
  create(@Body() body: CreatePolicyDto): Promise<PolicyResponseDto> {
    return this.proxyPoliciesUseCase.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a policy by id via policy-service' })
  @ApiOkResponse({ type: PolicyResponseDto })
  @ApiUnauthorizedResponse({ type: ProblemDetails })
  @ApiNotFoundResponse({ type: ProblemDetails })
  @ApiBadGatewayResponse({ type: ProblemDetails })
  getById(@Param('id') id: string): Promise<PolicyResponseDto> {
    return this.proxyPoliciesUseCase.getById(id);
  }
}
