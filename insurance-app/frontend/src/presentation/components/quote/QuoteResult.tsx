import { useState } from 'react';
import type { Quote } from '../../../domain/entities/quote';
import { formatCurrency, formatDate } from '../../../core/utils/formatters';
import { printQuoteAsPdf } from '../../../core/utils/print-quote';
import { Button } from '../common/Button';
import { ErrorBanner } from '../common/ErrorBanner';
import { BreakdownList } from './BreakdownList';

export function QuoteResult({ quote }: { quote: Quote }) {
  const [printError, setPrintError] = useState<string | null>(null);

  const handlePrint = () => {
    try {
      setPrintError(null);
      printQuoteAsPdf(quote);
    } catch (error) {
      setPrintError(error instanceof Error ? error.message : 'No fue posible abrir la vista de impresion.');
    }
  };

  return (
    <div className="space-y-6">
      {printError ? <ErrorBanner message={printError} onClose={() => setPrintError(null)} /> : null}

      <div className="relative overflow-hidden rounded-[30px] border border-teal-200/70 bg-[linear-gradient(135deg,rgba(240,253,250,0.98),rgba(239,246,255,0.98))] px-6 py-8 text-slate-900 shadow-[0_30px_70px_-34px_rgba(15,23,42,0.25)]">
        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 translate-x-6 -translate-y-6 rounded-full bg-teal-200/35 blur-2xl" />
        <div className="relative">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-teal-700">Prima estimada</p>
              <p className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">{formatCurrency(quote.estimatedPremium)}</p>
            </div>
            <Button type="button" variant="secondary" className="sm:shrink-0" onClick={handlePrint}>
              Imprimir PDF
            </Button>
          </div>
          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3">
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">ID de cotización</p>
              <p className="mt-2 font-medium text-slate-900">{quote.id}</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3">
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">Creada</p>
              <p className="mt-2 font-medium text-slate-900">{formatDate(quote.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200/70 bg-white/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">Desglose de la cotización</h3>
        <p className="mt-1 text-sm text-slate-600">Cada factor muestra cómo se construye el total estimado.</p>
        <div className="mt-5">
          <BreakdownList items={quote.breakdown} />
        </div>
      </div>
    </div>
  );
}
