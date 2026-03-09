import type { QuoteBreakdownItem } from '../../../domain/entities/quote';
import { formatBreakdownConcept, formatCurrency } from '../../../core/utils/formatters';

export function BreakdownList({ items }: { items: QuoteBreakdownItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item.concept}-${item.amount}`}
          className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-200/70 bg-white/80 px-4 py-4 text-sm shadow-[0_16px_34px_-28px_rgba(15,23,42,0.5)]"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">
              {index + 1}
            </span>
            <span className="font-medium text-slate-700">{formatBreakdownConcept(item.concept)}</span>
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">{formatCurrency(item.amount)}</span>
        </li>
      ))}
    </ul>
  );
}
