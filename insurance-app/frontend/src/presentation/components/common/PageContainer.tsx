import type { PropsWithChildren } from 'react';

export function PageContainer({ children }: PropsWithChildren) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fcf8ef_0%,#f7f1e4_48%,#f4f6f2_100%)] px-4 py-8 text-slate-900 sm:px-6 sm:py-10 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(15,118,110,0.08),transparent_24%),radial-gradient(circle_at_88%_10%,rgba(201,123,24,0.1),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.36),transparent_24%)]" />
      <div className="pointer-events-none absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-6rem] top-8 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-7rem] left-1/3 h-72 w-72 rounded-full bg-sky-100/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[linear-gradient(90deg,rgba(255,255,255,0.45),transparent,rgba(255,255,255,0.45))]" />
      <div className="relative mx-auto max-w-7xl">{children}</div>
    </main>
  );
}
