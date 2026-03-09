import { useState } from 'react';
import { normalizeApiError } from '../../../core/utils/error-mapper';
import type { Policy } from '../../../domain/entities/policy';
import type { Quote } from '../../../domain/entities/quote';
import { Button } from '../common/Button';
import { ErrorBanner } from '../common/ErrorBanner';

type IssuePolicySectionProps = {
  quote: Quote;
  policy: Policy | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onIssuePolicy: (quoteId: string) => Promise<unknown>;
};

export function IssuePolicySection({ quote, policy, isAuthenticated, isLoading, onIssuePolicy }: IssuePolicySectionProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (policy) {
    return <p className="text-sm text-emerald-700">La póliza ya fue emitida para esta cotización.</p>;
  }

  if (!isAuthenticated) {
    return <p className="text-sm text-slate-600">Debes iniciar sesión para emitir la póliza asociada a esta cotización.</p>;
  }

  const confirmIssuePolicy = async () => {
    setLocalError(null);

    try {
      await onIssuePolicy(quote.id);
      setIsConfirming(false);
    } catch (error) {
      setLocalError(normalizeApiError(error).message);
    }
  };

  return (
    <div className="space-y-4">
      {localError ? <ErrorBanner message={localError} onClose={() => setLocalError(null)} /> : null}
      <div className="rounded-[26px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,250,252,0.7))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Cotización seleccionada</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-teal-950">
            <p className="text-[0.68rem] uppercase tracking-[0.16em] text-teal-700">Quote ID</p>
            <p className="mt-2 text-sm font-medium">{quote.id}</p>
          </div>
          <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-teal-950">
            <p className="text-[0.68rem] uppercase tracking-[0.16em] text-teal-700">Estado</p>
            <p className="mt-2 text-sm font-semibold">{quote.status}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          La emisión usa la cotización actual y requiere confirmación explícita antes de crear la póliza.
        </p>
      </div>

      {!isConfirming ? (
        <Button type="button" loading={isLoading} onClick={() => setIsConfirming(true)}>
          Emitir póliza
        </Button>
      ) : (
        <div className="rounded-[28px] border border-amber-200/80 bg-[linear-gradient(180deg,rgba(255,251,235,0.96),rgba(255,247,237,0.92))] px-5 py-5 shadow-[0_18px_38px_-28px_rgba(202,138,4,0.6)]">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-amber-700">Confirmación</p>
          <p className="mt-3 text-sm font-medium leading-6 text-amber-950">¿Confirmas la emisión de la póliza para la cotización {quote.id}?</p>
          <div className="mt-4 flex gap-3">
            <Button type="button" loading={isLoading} onClick={() => void confirmIssuePolicy()}>
              Confirmar emisión
            </Button>
            <Button type="button" variant="ghost" disabled={isLoading} onClick={() => setIsConfirming(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
