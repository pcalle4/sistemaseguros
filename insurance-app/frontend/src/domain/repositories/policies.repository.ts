import type { Policy } from '../entities/policy';

export interface PoliciesRepository {
  issuePolicy(payload: { quoteId: string }): Promise<Policy>;
  getPolicyById(policyId: string): Promise<Policy>;
}
