import type { Policy } from '../../domain/entities/policy';
import type { PoliciesRepository } from '../../domain/repositories/policies.repository';

export class IssuePolicyUseCase {
  constructor(private readonly repository: PoliciesRepository) {}

  execute(payload: { quoteId: string }): Promise<Policy> {
    return this.repository.issuePolicy(payload);
  }
}
