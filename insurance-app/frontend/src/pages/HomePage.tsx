import { AppHeader } from '../components/AppHeader';
import { API_BASE_URL } from '../services/httpClient';

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-16">
      <section className="w-full rounded-2xl border border-white/10 bg-slate-900/70 p-10 shadow-2xl shadow-sky-900/20 backdrop-blur">
        <AppHeader />
        <div className="rounded-xl border border-white/10 bg-slate-950/80 p-6">
          <h2 className="text-lg font-medium text-slate-100">Estado del Scaffold</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>API Gateway esperado en: {API_BASE_URL}</li>
            <li>Quote Service esperado en: http://localhost:3060</li>
            <li>Policy Service esperado en: http://localhost:3070</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
