import { Inject, Injectable } from '@nestjs/common';
import { CreatePolicyDto } from '../dtos/create-policy.dto';
import { PolicyResponseDto } from '../dtos/policy-response.dto';
import {
  UPSTREAM_GATEWAY_CLIENT,
  UpstreamGatewayClient,
} from '../../domain/ports/upstream-gateway.client';
import { normalizeUpstreamError } from '../../shared/errors/normalize-upstream-error';

@Injectable()
export class ProxyPoliciesUseCase {
  constructor(
    @Inject(UPSTREAM_GATEWAY_CLIENT)
    private readonly upstreamGatewayClient: UpstreamGatewayClient,
  ) {}

  async create(input: CreatePolicyDto): Promise<PolicyResponseDto> {
    try {
      const response = await this.upstreamGatewayClient.post<PolicyResponseDto>({
        service: 'policy-service',
        path: '/policies',
        body: input,
      });

      return response.data;
    } catch (error) {
      normalizeUpstreamError(error);
    }
  }

  async getById(id: string): Promise<PolicyResponseDto> {
    try {
      const response = await this.upstreamGatewayClient.get<PolicyResponseDto>({
        service: 'policy-service',
        path: `/policies/${id}`,
      });

      return response.data;
    } catch (error) {
      normalizeUpstreamError(error);
    }
  }
}
