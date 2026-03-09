import type { Policy } from '../../../domain/entities/policy';
import { formatDate } from '../../../core/utils/formatters';

export function PolicyResult({ policy }: { policy: Policy }) {
  return (
    <div className="rounded-[30px] border border-emerald-200/80 bg-[linear-gradient(180deg,rgba(236,253,245,0.96),rgba(220,252,231,0.9))] px-6 py-6 shadow-[0_22px_50px_-34px_rgba(5,150,105,0.55)]">
      <p className="text-sm uppercase tracking-[0.18em] text-emerald-700">Póliza emitida</p>
      <div className="mt-5 grid gap-3 text-sm text-emerald-950 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200/80 bg-white/70 px-4 py-3">
          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-emerald-700">ID</p>
          <p className="mt-2 font-semibold">{policy.id}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200/80 bg-white/70 px-4 py-3">
          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-emerald-700">Estado</p>
          <p className="mt-2 font-semibold">{policy.status}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200/80 bg-white/70 px-4 py-3">
          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-emerald-700">Cotización</p>
          <p className="mt-2 font-semibold">{policy.quoteId}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200/80 bg-white/70 px-4 py-3">
          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-emerald-700">Emitida</p>
          <p className="mt-2 font-semibold">{formatDate(policy.issuedAt)}</p>
        </div>
      </div>
    </div>
  );
}
