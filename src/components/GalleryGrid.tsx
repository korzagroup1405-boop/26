'use client';

import { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import type { GalleryImage } from '@/lib/types';

export default function GalleryGrid({
  images,
  columns = 3,
}: {
  images: GalleryImage[];
  columns?: 2 | 3;
}) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((current) => (current === null ? null : (current + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () =>
      setActive((current) =>
        current === null ? null : (current - 1 + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close, next, prev]);

  if (images.length === 0) {
    return (
      <p className="rounded-xl2 border border-dashed border-gold/25 p-12 text-center text-sm text-beige">
        The gallery is being curated. Please check back soon.
      </p>
    );
  }

  return (
    <>
      <div
        className={
          columns === 2
            ? 'grid grid-cols-1 gap-4 sm:grid-cols-2'
            : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
        }
      >
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActive(index)}
            className="group relative block aspect-[4/3] overflow-hidden rounded-xl2 border border-gold/12 text-left transition-colors duration-500 hover:border-gold/40"
            aria-label={`Open ${image.title} in fullscreen`}
          >
            <img
              src={image.image}
              alt={image.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
              <span>
                <span className="block text-[9px] uppercase tracking-[0.3em] text-gold/90">
                  {image.category}
                </span>
                <span className="mt-1 block font-display text-xl text-cream">{image.title}</span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ink/50 text-gold opacity-0 transition-all duration-500 group-hover:opacity-100">
                <Expand size={14} />
              </span>
            </span>
          </button>
        ))}
      </div>

      {active !== null && images[active] && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${images[active].title} — fullscreen gallery`}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close fullscreen gallery"
            className="absolute inset-0 h-full w-full cursor-zoom-out"
          />
          <div className="relative z-10 w-full max-w-5xl">
            <img
              src={images[active].image}
              alt={images[active].title}
              className="max-h-[76svh] w-full rounded-xl2 border border-gold/25 object-contain"
            />
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-gold">
                  {images[active].category}
                </p>
                <p className="mt-1 font-display text-2xl text-cream">{images[active].title}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous image"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream transition hover:border-gold hover:text-gold"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="px-2 text-xs tabular-nums text-beige/70">
                  {active + 1} / {images.length}
                </span>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream transition hover:border-gold hover:text-gold"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="ml-2 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-gold/10 text-gold transition hover:bg-gold hover:text-ink"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
