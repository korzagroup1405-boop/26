import type { ReactNode } from 'react';

export default function PageHeader({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-14 pt-32 sm:pb-20 sm:pt-40">
      {image ? (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/92 via-ink/75 to-ink" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(249,185,35,0.10),transparent)]" />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(120,18,28,0.35),transparent)]"
        />
      )}

      <div className="container-x relative">
        <div className="max-w-3xl">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.6rem)] font-light leading-[1.02] text-cream text-balance">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-beige sm:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gold/15" />
    </section>
  );
}
