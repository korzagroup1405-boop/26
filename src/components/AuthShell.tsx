import Link from 'next/link';
import Logo from './Logo';

export default function AuthShell({
  image,
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[100svh] lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_20%,rgba(249,185,35,0.12),transparent)]" />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Logo size="md" asLink />
          <div>
            <span className="eyebrow">The Evening Letter</span>
            <blockquote className="mt-6 max-w-sm font-display text-[clamp(1.8rem,2.6vw,2.6rem)] font-light italic leading-[1.15] text-cream">
              “A room lit by amber lamps, where the night sets its own pace.”
            </blockquote>
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-gold/70">
              MEKAN 76 · KAFE NARGILE
            </p>
          </div>
          <p className="text-[11px] text-beige/50">
            © {new Date().getFullYear()} MEKAN 76 KAFE NARGILE
          </p>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-5 py-16 sm:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold/15" />
        <div className="w-full max-w-md">
          <div className="mb-9 flex flex-col items-center text-center lg:hidden">
            <Logo size="md" asLink />
          </div>
          <div className="lg:mt-0">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="mt-5 font-display text-[clamp(2.1rem,4.4vw,2.9rem)] leading-tight text-cream">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-beige">{description}</p>
          </div>

          <div className="mt-8">{children}</div>

          <div className="mt-7 text-center text-sm text-beige">{footer}</div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="text-[10px] uppercase tracking-[0.24em] text-beige/50 transition hover:text-gold"
            >
              ← Back to the lounge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
