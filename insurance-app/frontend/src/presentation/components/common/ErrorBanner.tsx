import { Button } from './Button';

type ErrorBannerProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
};

export function ErrorBanner({ message, actionLabel, onAction, onClose }: ErrorBannerProps) {
  return (
    <div className="rounded-[24px] border border-rose-200/80 bg-[linear-gradient(180deg,rgba(255,241,242,0.95),rgba(255,247,247,0.9))] px-4 py-4 text-sm text-rose-900 shadow-[0_18px_44px_-32px_rgba(190,24,93,0.5)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
            !
          </span>
          <p className="leading-6">{message}</p>
        </div>
        <div className="flex gap-2">
          {actionLabel && onAction ? (
            <Button type="button" variant="ghost" className="min-h-9 px-3 py-1 text-xs" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
          {onClose ? (
            <Button type="button" variant="ghost" className="min-h-9 px-3 py-1 text-xs" onClick={onClose}>
              Cerrar
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
