export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.9),rgba(255,255,255,0.8))] px-6 py-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <span className="inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Esperando datos
      </span>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
