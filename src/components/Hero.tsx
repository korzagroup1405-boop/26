'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import Magnetic from './Magnetic';
import type { Content } from '@/lib/content';

export default function Hero({ content, image }: { content: Content; image: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const frame = useRef<HTMLDivElement>(null);

  const words = content.hero_title.trim().split(' ');
  const accent = words.slice(-2).join(' ');
  const lead = words.slice(0, -2).join(' ');

  return (
    <section
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div
        ref={frame}
        className="absolute inset-0 -z-10"
        onMouseMove={(event) => {
          const rect = frame.current?.getBoundingClientRect();
          if (!rect) return;
          setTilt({
            x: ((event.clientX - rect.left) / rect.width - 0.5) * -14,
            y: ((event.clientY - rect.top) / rect.height - 0.5) * -10,
          });
        }}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div
          className="absolute inset-[-3%] transition-transform duration-[1200ms] ease-out"
          style={{ transform: `translate3d(${tilt.x}px, ${tilt.y}px, 0) scale(1.02)` }}
        >
          <img
            src={image}
            alt="The candlelit dining room of MEKAN 76 KAFE NARGILE at dusk"
            className="h-full w-full animate-kenburns object-cover object-center"
            fetchPriority="high"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(115%_95%_at_50%_38%,rgba(36,4,7,0.08),rgba(36,4,7,0.45)_62%,rgba(36,4,7,0.92)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/5 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-ink/45" />
      </div>

      <div className="container-x relative z-10 pb-28 pt-32 sm:pb-32 lg:pb-36 lg:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[560px] w-[820px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(36,4,7,0.62),rgba(36,4,7,0.28)_60%,transparent)] blur-2xl"
        />
        <div className="mx-auto max-w-4xl text-center">
          <span className="eyebrow eyebrow-center justify-center animate-floatIn">
            {content.hero_eyebrow}
          </span>

          <h1
            id="hero-title"
            className="mt-7 font-display text-[clamp(2.7rem,7.2vw,6rem)] font-light leading-[0.98] tracking-[-0.02em] text-cream text-balance"
            style={{ animation: 'floatIn 1000ms 80ms cubic-bezier(0.16,1,0.3,1) both' }}
          >
            {lead}{' '}
            <span className="italic gold-text">{accent}</span>
          </h1>

          <p
            className="mx-auto mt-7 max-w-2xl text-[15px] leading-relaxed text-cream/75 text-pretty sm:text-[17px]"
            style={{ animation: 'floatIn 1000ms 200ms cubic-bezier(0.16,1,0.3,1) both' }}
          >
            {content.hero_subtitle}
          </p>

          <div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            style={{ animation: 'floatIn 1000ms 320ms cubic-bezier(0.16,1,0.3,1) both' }}
          >
            <Magnetic>
              <Link href="/menu" className="btn-gold w-full sm:w-auto">
                Explore Menu <ArrowRight size={15} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/menu#menu-grid" className="btn-outline w-full sm:w-auto">
                Order Food
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/reservations" className="btn-outline w-full sm:w-auto">
                Book a Table
              </Link>
            </Magnetic>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[10px] uppercase tracking-[0.24em] text-cream/55">
            <span>{content.hero_note}</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container-x">
          <div className="flex flex-col items-center gap-5 border-t border-gold/15 py-5 sm:flex-row sm:justify-between">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.22em] text-beige/70">
              <li>Charcoal Grill</li>
              <li aria-hidden="true" className="text-gold/60">◆</li>
              <li>Hand-poured Coffee</li>
              <li aria-hidden="true" className="text-gold/60">◆</li>
              <li>Premium Shisha</li>
              <li aria-hidden="true" className="text-gold/60">◆</li>
              <li>Live Oud</li>
            </ul>
            <a
              href="#menu-preview"
              className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-cream/70 transition hover:text-gold"
            >
              Scroll to explore
              <ArrowDown size={13} className="transition group-hover:translate-y-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
