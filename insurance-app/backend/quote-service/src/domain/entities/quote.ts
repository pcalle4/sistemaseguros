import { BreakdownItem } from './breakdown-item';

export type QuoteStatus = 'QUOTED';

export type QuoteInputs = {
  insuranceType: string;
  coverage: string;
  age: number;
  location: string;
};

export type Quote = {
  id: string;
  status: QuoteStatus;
  inputs: QuoteInputs;
  estimatedPremium: number;
  breakdown: BreakdownItem[];
  createdAt: Date;
};
