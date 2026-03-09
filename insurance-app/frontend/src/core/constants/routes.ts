export const apiRoutes = {
  catalogs: {
    insuranceTypes: '/catalogs/insurance-types',
    coverages: '/catalogs/coverages',
    locations: '/catalogs/locations',
  },
  login: '/auth/login',
  quotes: '/quotes',
  quoteById: (quoteId: string) => `/quotes/${quoteId}`,
  policies: '/policies',
  policyById: (policyId: string) => `/policies/${policyId}`,
} as const;

export const appRoutes = {
  login: '/login',
  quoter: '/',
} as const;
