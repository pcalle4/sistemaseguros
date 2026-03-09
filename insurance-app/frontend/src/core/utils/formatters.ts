import { breakdownLabels } from '../constants/ui';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatBreakdownConcept(concept: string): string {
  return breakdownLabels[concept] ?? concept.replace(/_/g, ' ');
}
