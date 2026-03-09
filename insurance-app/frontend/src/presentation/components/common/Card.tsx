import type { PropsWithChildren } from 'react';
import { cn } from '../../../core/utils/cn';

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[32px] border border-white/50 bg-[rgba(255,252,245,0.78)] p-6 shadow-[0_30px_80px_-36px_rgba(15,23,42,0.42)] ring-1 ring-slate-900/5 backdrop-blur-xl sm:p-8',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      {children}
    </section>
  );
}
