import { z } from 'zod';

export const quoteFormSchema = z.object({
  insuranceType: z.string().min(1, 'Selecciona un tipo de seguro'),
  coverage: z.string().min(1, 'Selecciona una cobertura'),
  age: z.coerce.number().int('La edad debe ser un número entero').min(18, 'La edad mínima es 18').max(100, 'La edad máxima es 100'),
  location: z.string().min(1, 'Selecciona una ubicación'),
});

export type QuoteFormInput = z.input<typeof quoteFormSchema>;
export type QuoteFormValues = z.output<typeof quoteFormSchema>;
