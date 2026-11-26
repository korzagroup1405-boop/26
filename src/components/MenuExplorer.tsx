'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Check, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useCart } from './cart/CartProvider';
import { CATEGORIES, type MenuItem } from '@/lib/types';
import { cx, formatPrice } from '@/lib/format';

export default function MenuExplorer({
  items,
  limit,
  note,
  initialCategory = 'All',
}: {
  items: MenuItem[];
  limit?: number;
  note?: string;
  initialCategory?: string;
}) {
  const [category, setCategory] = useState<string>(initialCategory);
  const [query, setQuery] = useState('');
  const { add, lastAdded, setOpen, count } = useCart();

  const categories = ['All', ...CATEGORIES];

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const result = items.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesQuery =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);
      return matchesCategory && matchesQuery && item.is_available;
    });
    return limit ? result.slice(0, limit) : result;
  }, [items, category, query, limit]);

  const totalMatches = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesQuery =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);
      return matchesCategory && matchesQuery && item.is_available;
    }).length;
  }, [items, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setCategory(entry)}
              aria-pressed={category === entry}
              className={cx('chip', category === entry ? 'chip-active' : 'chip-idle')}
            >
              {entry}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search
            size={15}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-beige/50"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search dishes, drinks…"
            aria-label="Search the menu"
            className="field h-11 rounded-full pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-beige/60">
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={12} className="text-gold/70" />
          {filtered.length} {filtered.length === 1 ? 'creation' : 'creations'}
          {limit && totalMatches > filtered.length ? ` of ${totalMatches}` : ''}
        </span>
        {note && <span className="hidden max-w-md text-right normal-case tracking-normal text-beige/45 sm:block">{note}</span>}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl2 border border-dashed border-gold/25 p-14 text-center">
          <p className="font-display text-2xl text-cream">Nothing matches that search</p>
          <p className="mt-2 text-sm text-beige">
            Try another category or a different word — our full menu is waiting.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('All');
            }}
            className="btn-outline mt-6"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const justAdded = lastAdded === item.id;
            return (
              <article
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-xl2 card-surface transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={`${item.name} — ${item.description}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
                  {item.badge && (
                    <span className="absolute left-4 top-4 rounded-full border border-gold/50 bg-ink/70 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-gold backdrop-blur">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute bottom-4 right-4 rounded-full bg-ink/75 px-3 py-1 font-display text-base text-gold backdrop-blur">
                    {formatPrice(item.price)}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[23px] leading-tight text-cream">
                      {item.name}
                    </h3>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-beige">
                    {item.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <span className="text-[9px] uppercase tracking-[0.24em] text-gold/60">
                      {item.category}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        add({
                          id: item.id,
                          name: item.name,
                          price: Number(item.price),
                          image: item.image,
                        })
                      }
                      className={cx(
                        'inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 text-[10px] font-semibold uppercase tracking-[0.16em] transition-all duration-300',
                        justAdded
                          ? 'border-gold bg-gold text-ink'
                          : 'border-gold/35 text-cream hover:border-gold hover:bg-gold hover:text-ink',
                      )}
                      aria-label={`Add ${item.name} to your order`}
                    >
                      {justAdded ? <Check size={13} /> : <Plus size={13} />}
                      {justAdded ? 'Added' : 'Add'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        {note && <p className="text-[11px] text-beige/45 sm:hidden">{note}</p>}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {limit && (
            <Link href="/menu" className="btn-outline w-full sm:w-auto">
              View the full menu <ArrowRight size={15} />
            </Link>
          )}
          {count > 0 && (
            <button type="button" onClick={() => setOpen(true)} className="btn-gold w-full sm:w-auto">
              Review order ({count})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
