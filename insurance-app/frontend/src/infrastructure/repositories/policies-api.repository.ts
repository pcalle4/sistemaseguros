import type { AxiosInstance } from 'axios';
import { apiRoutes } from '../../core/constants/routes';
import type { CreatePolicyApiRequest, PolicyApiResponse } from '../../core/types/api';
import type { Policy } from '../../domain/entities/policy';
import type { PoliciesRepository } from '../../domain/repositories/policies.repository';

function toPolicy(data: PolicyApiResponse): Policy {
  return {
    id: data.id,
    quoteId: data.quoteId,
    status: data.status,
    issuedAt: data.issuedAt,
  };
}

export class PoliciesApiRepository implements PoliciesRepository {
  constructor(private readonly client: AxiosInstance) {}

  async issuePolicy(payload: CreatePolicyApiRequest): Promise<Policy> {
    const response = await this.client.post<PolicyApiResponse>(apiRoutes.policies, payload);
    return toPolicy(response.data);
  }

  async getPolicyById(policyId: string): Promise<Policy> {
    const response = await this.client.get<PolicyApiResponse>(apiRoutes.policyById(policyId));
    return toPolicy(response.data);
  }
}
