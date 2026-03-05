import { Inject, Injectable } from '@nestjs/common';
import { POLICIES_REPOSITORY, PoliciesRepository } from '../../domain/ports/policies.repository';
import { NotFoundDomainException } from '../../shared/errors/domain-exceptions';

@Injectable()
export class GetPolicyUseCase {
  constructor(
    @Inject(POLICIES_REPOSITORY)
    private readonly policiesRepository: PoliciesRepository,
  ) {}

  async execute(id: string) {
    const policy = await this.policiesRepository.findById(id);

    if (!policy) {
      throw new NotFoundDomainException('Policy not found');
    }

    return policy;
  }
}
