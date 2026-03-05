export function AppHeader() {
  return (
    <header className="mb-8">
      <span className="inline-block rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-200">
        Insurance Platform
      </span>
      <h1 className="mt-4 text-4xl font-semibold text-white">Insurance Quoter</h1>
      <p className="mt-2 max-w-2xl text-slate-300">
        Frontend scaffold listo para conectar cotizaciones y pólizas desde el API Gateway.
      </p>
    </header>
  );
}
