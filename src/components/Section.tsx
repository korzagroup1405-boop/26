import type { ReactNode } from 'react';
import { cx } from '@/lib/format';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
}) {
  const centered = align === 'center';
  return (
    <div
      className={cx(
        'flex flex-col gap-6',
        centered ? 'items-center text-center' : 'items-start',
        action && !centered ? 'md:flex-row md:items-end md:justify-between' : '',
      )}
    >
      <div className={cx('max-w-2xl', centered && 'mx-auto')}>
        <span className={cx('eyebrow', centered && 'eyebrow-center justify-center')}>{eyebrow}</span>
        <h2 className="mt-5 font-display text-[clamp(2rem,4.6vw,3.4rem)] font-light leading-[1.08] text-cream text-balance">
          {title}
        </h2>
        {description && (
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-beige text-pretty sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
  tone = 'ink',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: 'ink' | 'wine';
}) {
  return (
    <section
      id={id}
      className={cx(
        'relative py-20 sm:py-24 lg:py-28',
        tone === 'wine' && 'bg-wine/40',
        className,
      )}
    >
      {tone === 'wine' && (
        <>
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gold/12" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gold/12" />
        </>
      )}
      {children}
    </section>
  );
}
