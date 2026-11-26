'use client';

import { useEffect, type ReactNode } from 'react';
import { X, Loader2 } from 'lucide-react';
import { cx } from '@/lib/format';

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default bg-ink/85 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(
          'relative my-6 w-full rounded-xl2 border border-gold/25 bg-wine shadow-soft',
          wide ? 'max-w-3xl' : 'max-w-xl',
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-gold/15 px-6 py-5">
          <div>
            <h2 className="font-display text-2xl leading-tight text-cream">{title}</h2>
            {description && <p className="mt-1 text-xs text-beige">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/15 text-beige transition hover:border-gold/60 hover:text-gold"
          >
            <X size={16} />
          </button>
        </header>
        <div className="max-h-[70svh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="border-t border-gold/15 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cx('block', className)}>
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-beige/50">{hint}</span>}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cx(
        'inline-flex min-h-[36px] items-center gap-2 rounded-full border px-3 text-[10px] uppercase tracking-[0.14em] transition',
        checked
          ? 'border-gold/60 bg-gold/15 text-gold'
          : 'border-cream/15 text-beige hover:border-cream/30',
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          'relative h-4 w-7 rounded-full transition-colors',
          checked ? 'bg-gold' : 'bg-cream/20',
        )}
      >
        <span
          className={cx(
            'absolute top-0.5 h-3 w-3 rounded-full bg-ink transition-all',
            checked ? 'left-3.5' : 'left-0.5',
          )}
        />
      </span>
      {label}
    </button>
  );
}

const pillTones: Record<string, string> = {
  PENDING: 'border-gold/45 bg-gold/10 text-gold',
  CONFIRMED: 'border-emerald-300/40 bg-emerald-400/10 text-emerald-200',
  SEATED: 'border-cream/25 bg-cream/5 text-cream/80',
  CANCELLED: 'border-cream/12 bg-ink/40 text-beige/50',
  NEW: 'border-gold/45 bg-gold/10 text-gold',
  PREPARING: 'border-sky-300/40 bg-sky-400/10 text-sky-200',
  SERVED: 'border-emerald-300/40 bg-emerald-400/10 text-emerald-200',
  ADMIN: 'border-gold/45 bg-gold/10 text-gold',
  CUSTOMER: 'border-cream/20 bg-cream/5 text-beige',
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.14em]',
        pillTones[status] ?? 'border-cream/20 text-beige',
      )}
    >
      {status}
    </span>
  );
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-beige">
      <Loader2 size={16} className="animate-spin text-gold" />
      {label}…
    </div>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = 'gold',
  type = 'button',
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'gold' | 'outline' | 'danger';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full px-4 text-[10px] font-semibold uppercase tracking-[0.16em] transition disabled:opacity-50',
        variant === 'gold' && 'bg-gold text-ink hover:bg-goldSoft',
        variant === 'outline' && 'border border-gold/40 text-cream hover:border-gold hover:text-gold',
        variant === 'danger' && 'border border-red-300/30 text-red-200/80 hover:border-red-300/60 hover:text-red-200',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx('rounded-xl2 border border-gold/15 bg-wine/40', className)}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-cream/8 px-5 py-4">
        <h2 className="font-display text-xl text-cream">{title}</h2>
        {action}
      </header>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <p className="py-10 text-center text-sm text-beige">{message}</p>;
}
