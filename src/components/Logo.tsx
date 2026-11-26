import Link from 'next/link';
import { cx } from '@/lib/format';

type LogoProps = {
  variant?: 'stacked' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string | null;
  asLink?: boolean;
};

const sizes = {
  sm: { mark: 'h-9 w-7 text-[12px]', name: 'text-[15px]', sub: 'text-[7px] tracking-[0.42em]' },
  md: { mark: 'h-12 w-9 text-[16px]', name: 'text-[20px]', sub: 'text-[8px] tracking-[0.5em]' },
  lg: { mark: 'h-16 w-12 text-[22px]', name: 'text-[30px] sm:text-[34px]', sub: 'text-[10px] tracking-[0.55em]' },
};

export default function Logo({
  variant = 'stacked',
  size = 'md',
  className,
  href = '/',
  asLink = true,
}: LogoProps) {
  const s = sizes[size];

  const mark = (
    <span
      aria-hidden="true"
      className={cx(
        'relative flex shrink-0 items-end justify-center rounded-t-[999px] border border-gold/45 pb-1.5 font-display leading-none text-gold',
        s.mark,
      )}
      style={{ boxShadow: 'inset 0 0 18px rgba(249,185,35,0.12)' }}
    >
      <span className="absolute inset-x-1 top-1 h-px bg-gold/20" />
      76
    </span>
  );

  const wordmark = (
    <span className={cx('flex flex-col', variant === 'inline' ? 'items-start' : 'items-center')}>
      <span
        className={cx(
          'font-display font-normal leading-none tracking-[0.14em] text-cream',
          s.name,
        )}
      >
        MEKAN 76
      </span>
      <span className={cx('mt-1.5 font-sans uppercase leading-none text-gold/80', s.sub)}>
        Kafe Nargile
      </span>
    </span>
  );

  const content = (
    <span
      className={cx(
        'flex items-center',
        variant === 'stacked' ? 'flex-col gap-2.5 text-center' : 'gap-3',
        className,
      )}
    >
      {mark}
      {wordmark}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link
      href={href ?? '/'}
      aria-label="MEKAN 76 KAFE NARGILE — home"
      className="group inline-flex transition-opacity duration-300 hover:opacity-90"
    >
      {content}
    </Link>
  );
}
