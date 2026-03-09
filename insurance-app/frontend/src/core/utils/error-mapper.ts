import axios, { type AxiosError } from 'axios';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { env } from '../config/env';
import { AppApiError, type MappedProblemDetails, type ProblemDetails } from '../types/problem-details';

function isProblemDetails(value: unknown): value is ProblemDetails {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ProblemDetails>;
  return (
    typeof candidate.title === 'string' &&
    typeof candidate.status === 'number' &&
    typeof candidate.detail === 'string'
  );
}

function mapProblemDetails(problem: ProblemDetails): MappedProblemDetails {
  return {
    status: problem.status,
    globalMessage: problem.detail || problem.title,
    fieldErrors: Object.fromEntries((problem.errors ?? []).map((item) => [item.field, item.message])),
    traceId: problem.traceId,
    detail: problem.detail,
  };
}

export function normalizeApiError(error: unknown): AppApiError {
  if (error instanceof AppApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ProblemDetails>;

    if (axiosError.response?.data && isProblemDetails(axiosError.response.data)) {
      return new AppApiError(mapProblemDetails(axiosError.response.data));
    }

    if (!axiosError.response) {
      return new AppApiError({
        globalMessage: `No fue posible conectar con el API Gateway en ${env.apiBaseUrl}. Verifica que esté levantado.`,
        fieldErrors: {},
      });
    }

    return new AppApiError({
      status: axiosError.response?.status,
      globalMessage:
        axiosError.code === 'ECONNABORTED'
          ? 'La solicitud tardó demasiado. Intenta nuevamente.'
          : 'No fue posible completar la solicitud.',
      fieldErrors: {},
    });
  }

  if (error instanceof Error) {
    return new AppApiError({
      globalMessage: error.message || 'Ocurrió un error inesperado.',
      fieldErrors: {},
    });
  }

  return new AppApiError({
    globalMessage: 'Ocurrió un error inesperado.',
    fieldErrors: {},
  });
}

export function applyFieldErrors<TFieldValues extends FieldValues>(
  fieldErrors: Record<string, string>,
  setError: UseFormSetError<TFieldValues>,
): void {
  for (const [field, message] of Object.entries(fieldErrors)) {
    setError(field as Path<TFieldValues>, { type: 'server', message });
  }
}
