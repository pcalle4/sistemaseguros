import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { applyFieldErrors, normalizeApiError } from '../../../core/utils/error-mapper';
import type { CatalogItem } from '../../../domain/entities/catalog';
import { quoteFormSchema, type QuoteFormInput, type QuoteFormValues } from '../../../domain/value-objects/quote-form';
import { Button } from '../common/Button';
import { ErrorBanner } from '../common/ErrorBanner';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Spinner } from '../common/Spinner';

type QuoteFormProps = {
  insuranceTypes: CatalogItem[];
  locations: CatalogItem[];
  coverages: CatalogItem[];
  isLoadingCatalogs: boolean;
  isLoadingCoverages: boolean;
  coveragesError: string | null;
  onRetryCoverages: () => void;
  onInsuranceTypeChange: (insuranceType: string) => void;
  onSubmitQuote: (values: QuoteFormValues) => Promise<unknown>;
  isSubmitting: boolean;
};

export function QuoteForm({
  insuranceTypes,
  locations,
  coverages,
  isLoadingCatalogs,
  isLoadingCoverages,
  coveragesError,
  onRetryCoverages,
  onInsuranceTypeChange,
  onSubmitQuote,
  isSubmitting,
}: QuoteFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const previousInsuranceTypeRef = useRef<string>('');
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<QuoteFormInput, unknown, QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      insuranceType: '',
      coverage: '',
      age: '35',
      location: '',
    },
  });

  const insuranceType = watch('insuranceType');
  const hasCoverages = useMemo(() => coverages.length > 0, [coverages.length]);

  useEffect(() => {
    if (insuranceType === previousInsuranceTypeRef.current) {
      return;
    }

    previousInsuranceTypeRef.current = insuranceType;
    setValue('coverage', '');
    clearErrors('coverage');
    setSubmitError(null);
    void onInsuranceTypeChange(insuranceType);
  }, [clearErrors, insuranceType, onInsuranceTypeChange, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await onSubmitQuote(values);
    } catch (error) {
      const mappedError = normalizeApiError(error);
      applyFieldErrors(mappedError.fieldErrors, setError);

      if (Object.keys(mappedError.fieldErrors).length === 0) {
        setSubmitError(mappedError.message);
      }
    }
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {submitError ? <ErrorBanner message={submitError} onClose={() => setSubmitError(null)} /> : null}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5 rounded-[28px] border border-slate-200/70 bg-white/55 p-5">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Cobertura del seguro</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Define el producto y la cobertura que se usarán para el cálculo.</p>
          </div>

          <Select
            id="insuranceType"
            label="Tipo de seguro"
            placeholder={isLoadingCatalogs ? 'Cargando tipos...' : 'Selecciona una opción'}
            disabled={isLoadingCatalogs || isSubmitting}
            error={errors.insuranceType?.message}
            {...register('insuranceType')}
          >
            {insuranceTypes.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </Select>

          <Select
            id="coverage"
            label="Cobertura"
            placeholder={
              insuranceType
                ? isLoadingCoverages
                  ? 'Cargando coberturas...'
                  : 'Selecciona una cobertura'
                : 'Selecciona primero el tipo de seguro'
            }
            disabled={!insuranceType || isLoadingCoverages || isSubmitting}
            error={errors.coverage?.message}
            {...register('coverage')}
          >
            {coverages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </Select>

          {isLoadingCoverages ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Spinner className="size-4 text-teal-700" />
              <span>Cargando coberturas disponibles...</span>
            </div>
          ) : null}

          {coveragesError ? <ErrorBanner message={coveragesError} actionLabel="Reintentar" onAction={onRetryCoverages} /> : null}

          {insuranceType && !isLoadingCoverages && !hasCoverages && !coveragesError ? (
            <p className="text-sm text-slate-500">No hay coberturas disponibles para el tipo de seguro seleccionado.</p>
          ) : null}
        </div>

        <div className="space-y-5 rounded-[28px] border border-slate-200/70 bg-white/55 p-5">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Perfil del solicitante</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Completa los datos mínimos para aplicar factores de edad y ubicación.</p>
          </div>

          <Input
            id="age"
            label="Edad"
            type="number"
            min={18}
            max={100}
            disabled={isSubmitting}
            error={errors.age?.message}
            {...register('age')}
          />

          <Select
            id="location"
            label="Ubicación"
            placeholder={isLoadingCatalogs ? 'Cargando ubicaciones...' : 'Selecciona una ubicación'}
            disabled={isLoadingCatalogs || isSubmitting}
            error={errors.location?.message}
            {...register('location')}
          >
            {locations.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[28px] border border-teal-200/70 bg-[linear-gradient(135deg,rgba(240,253,250,0.98),rgba(255,255,255,0.96))] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-teal-700">Procesamiento en línea</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            El cálculo se realiza contra el API Gateway real y actualiza el breakdown en tiempo real.
          </p>
        </div>
        <Button type="submit" loading={isSubmitting}>
          Cotizar
        </Button>
      </div>
    </form>
  );
}
