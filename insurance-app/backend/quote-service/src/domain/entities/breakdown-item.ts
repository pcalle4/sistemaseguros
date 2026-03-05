export type BreakdownConcept = 'BASE' | 'AGE_FACTOR' | 'LOCATION_FACTOR' | 'COVERAGE_FACTOR';

export type BreakdownItem = {
  concept: BreakdownConcept;
  amount: number;
};
