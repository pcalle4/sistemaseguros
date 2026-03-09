import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../../core/utils/cn';
import { Spinner } from './Spinner';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

export function Button({ className, children, loading = false, variant = 'primary', disabled, ...props }: ButtonProps) {
  const variantClassName =
    variant === 'secondary'
      ? 'bg-white/90 text-slate-900 ring-1 ring-slate-200/80 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] hover:bg-white'
      : variant === 'ghost'
        ? 'bg-white/50 text-slate-700 ring-1 ring-slate-200/80 hover:bg-white/80'
        : variant === 'danger'
          ? 'bg-rose-600 text-white shadow-[0_18px_38px_-20px_rgba(190,24,93,0.7)] hover:bg-rose-700'
          : 'bg-[linear-gradient(135deg,#0f766e_0%,#155e75_100%)] text-white shadow-[0_18px_38px_-20px_rgba(15,118,110,0.7)] hover:brightness-105';

  return (
    <button
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-60',
        variantClassName,
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner className="size-4" /> : null}
      <span>{children}</span>
    </button>
  );
}
