import { Policy, PolicyStatus } from '../entities/policy';

export type CreatePolicyInput = {
  id: string;
  quoteId: string;
  status: PolicyStatus;
  issuedAt: Date;
};

export interface PoliciesRepository {
  create(input: CreatePolicyInput): Promise<Policy>;
  findById(id: string): Promise<Policy | null>;
}

export const POLICIES_REPOSITORY = 'POLICIES_REPOSITORY';
