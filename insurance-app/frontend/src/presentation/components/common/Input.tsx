import type { InputHTMLAttributes } from 'react';
import { cn } from '../../../core/utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ id, label, error, className, ...props }: InputProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <label className="block">
      <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={cn(
          'w-full rounded-[22px] border bg-white/90 px-4 py-3.5 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_30px_-24px_rgba(15,23,42,0.6)] outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10',
          error ? 'border-rose-400 bg-rose-50/60' : 'border-slate-200/80',
          className,
        )}
        {...props}
      />
      {error ? (
        <span id={errorId} className="mt-2 block text-sm text-rose-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}
