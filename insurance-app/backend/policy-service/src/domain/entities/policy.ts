export type PolicyStatus = 'ACTIVE';

export type Policy = {
  id: string;
  quoteId: string;
  status: PolicyStatus;
  issuedAt: Date;
};
