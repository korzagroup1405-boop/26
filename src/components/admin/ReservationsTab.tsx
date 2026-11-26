'use client';

import { useMemo, useState } from 'react';
import { Check, Search, Trash2, X, Armchair } from 'lucide-react';
import { api, useResource } from './api';
import { AdminButton, EmptyState, Spinner, StatusPill } from './ui';
import type { Reservation } from '@/lib/types';
import { formatDate, reference } from '@/lib/format';

const FILTERS = ['All', 'PENDING', 'CONFIRMED', 'SEATED', 'CANCELLED'];

export default function ReservationsTab() {
  const { items, loading, error, reload, setItems } = useResource<Reservation>('reservations');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      items.filter((reservation) => {
        const matchesFilter = filter === 'All' || reservation.status === filter;
        const term = query.trim().toLowerCase();
        const matchesQuery =
          !term ||
          reservation.name.toLowerCase().includes(term) ||
          reservation.email.toLowerCase().includes(term) ||
          reservation.phone.toLowerCase().includes(term);
        return matchesFilter && matchesQuery;
      }),
    [items, filter, query],
  );

  const setStatus = async (reservation: Reservation, status: string) => {
    setItems((current) =>
      current.map((entry) => (entry.id === reservation.id ? { ...entry, status } : entry)),
    );
    try {
      await api(`/api/admin/reservations/${reservation.id}`, {
        method: 'PATCH',
        body: { status },
      });
    } catch {
      reload();
    }
  };

  const remove = async (reservation: Reservation) => {
    if (!window.confirm(`Delete the reservation for ${reservation.name}?`)) return;
    setItems((current) => current.filter((entry) => entry.id !== reservation.id));
    try {
      await api(`/api/admin/reservations/${reservation.id}`, { method: 'DELETE' });
    } catch {
      reload();
    }
  };

  const pending = items.filter((entry) => entry.status === 'PENDING').length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-cream">Reservations</h1>
          <p className="mt-1 text-sm text-beige">
            {items.length} bookings · {pending} awaiting confirmation.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-beige/50" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, phone"
            aria-label="Search reservations"
            className="field h-11 rounded-full pl-10 text-sm"
          />
        </div>
      </div>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setFilter(entry)}
            aria-pressed={filter === entry}
            className={`chip ${filter === entry ? 'chip-active' : 'chip-idle'}`}
          >
            {entry === 'All' ? 'All bookings' : entry.toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading reservations" />
      ) : error ? (
        <EmptyState message={error} />
      ) : filtered.length === 0 ? (
        <EmptyState message="No reservations match this view." />
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl2 border border-gold/15">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-ink/60 text-[9px] uppercase tracking-[0.18em] text-beige/70">
              <tr>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Party</th>
                <th className="px-4 py-3 font-medium">Requests</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/8">
              {filtered.map((reservation) => (
                <tr key={reservation.id} className="bg-wine/20 align-top transition-colors hover:bg-wine/40">
                  <td className="px-4 py-3">
                    <p className="font-medium text-cream">{reservation.name}</p>
                    <p className="text-xs text-beige/70">{reservation.email}</p>
                    <p className="text-xs text-beige/50">{reservation.phone}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-gold/50">
                      {reference('MK76', reservation.id)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-beige">
                    <p className="text-cream/90">{formatDate(reservation.date)}</p>
                    <p className="text-xs">{reservation.time}</p>
                  </td>
                  <td className="px-4 py-3 text-beige">{reservation.guests}</td>
                  <td className="max-w-[240px] px-4 py-3 text-xs text-beige/80">
                    {reservation.requests || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={reservation.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {reservation.status === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => setStatus(reservation, 'CONFIRMED')}
                          className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-emerald-300/40 px-3 text-[9px] uppercase tracking-[0.14em] text-emerald-200 transition hover:bg-emerald-400/10"
                        >
                          <Check size={12} /> Confirm
                        </button>
                      )}
                      {reservation.status === 'CONFIRMED' && (
                        <button
                          type="button"
                          onClick={() => setStatus(reservation, 'SEATED')}
                          className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-cream/25 px-3 text-[9px] uppercase tracking-[0.14em] text-cream/80 transition hover:border-gold/50 hover:text-gold"
                        >
                          <Armchair size={12} /> Seat
                        </button>
                      )}
                      {reservation.status !== 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={() => setStatus(reservation, 'CANCELLED')}
                          className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-cream/15 px-3 text-[9px] uppercase tracking-[0.14em] text-beige transition hover:border-gold/40 hover:text-gold"
                        >
                          <X size={12} /> Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(reservation)}
                        aria-label={`Delete reservation for ${reservation.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/12 text-beige transition hover:border-red-300/50 hover:text-red-200"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
