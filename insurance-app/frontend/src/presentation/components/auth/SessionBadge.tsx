import { Button } from '../common/Button';

export function SessionBadge({ email, onLogout }: { email: string; onLogout: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-teal-200/70 bg-[linear-gradient(135deg,rgba(236,253,245,0.98),rgba(240,249,255,0.96))] px-5 py-5 text-slate-900 shadow-[0_30px_60px_-34px_rgba(15,23,42,0.22)] sm:px-6">
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-teal-200/30 blur-2xl" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-teal-700">Sesión activa</p>
          <p className="mt-1 text-sm font-medium text-slate-900">Sesión iniciada como {email}</p>
          <p className="mt-1 text-xs text-slate-600">Puedes emitir pólizas desde esta sesión protegida.</p>
        </div>
        <Button type="button" variant="secondary" onClick={onLogout}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
