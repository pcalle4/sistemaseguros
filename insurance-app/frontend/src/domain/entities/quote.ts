export interface QuoteInput {
  insuranceType: string;
  coverage: string;
  age: number;
  location: string;
}

export interface QuoteBreakdownItem {
  concept: string;
  amount: number;
}

export interface Quote {
  id: string;
  status: 'QUOTED';
  inputs: QuoteInput;
  estimatedPremium: number;
  breakdown: QuoteBreakdownItem[];
  createdAt: string;
}
