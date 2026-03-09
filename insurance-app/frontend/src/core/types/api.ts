export interface CatalogItemApi {
  code: string;
  name: string;
}

export interface CatalogItemsApiResponse {
  items: CatalogItemApi[];
}

export interface CreateQuoteApiRequest {
  insuranceType: string;
  coverage: string;
  age: number;
  location: string;
}

export interface QuoteBreakdownItemApi {
  concept: string;
  amount: number;
}

export interface QuoteApiResponse {
  id: string;
  status: 'QUOTED';
  inputs: CreateQuoteApiRequest;
  estimatedPremium: number;
  breakdown: QuoteBreakdownItemApi[];
  createdAt: string;
}

export interface LoginApiRequest {
  email: string;
  password: string;
}

export interface LoginApiResponse {
  accessToken: string;
  tokenType: string;
}

export interface CreatePolicyApiRequest {
  quoteId: string;
}

export interface PolicyApiResponse {
  id: string;
  quoteId: string;
  status: 'ACTIVE';
  issuedAt: string;
}
