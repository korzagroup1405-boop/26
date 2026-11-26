'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Clock, Users, X, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { formatDate, reference } from '@/lib/format';
import type { Reservation } from '@/lib/types';

const statusStyles: Record<string, string> = {
  PENDING: 'border-gold/40 text-gold',
  CONFIRMED: 'border-emerald-300/40 text-emerald-200',
  SEATED: 'border-cream/25 text-cream/80',
  CANCELLED: 'border-cream/15 text-beige/50',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Awaiting confirmation',
  CONFIRMED: 'Confirmed',
  SEATED: 'Seated',
  CANCELLED: 'Cancelled',
};

export default function MyReservations({ initial }: { initial: Reservation[] }) {
  const [reservations, setReservations] = useState(initial);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cancel = async (id: number) => {
    setBusyId(id);
    setError(null);
    try {
      const response = await fetch(`/api/account/reservations/${id}`, { method: 'PATCH' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error ?? 'Could not cancel.');
      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id ? { ...reservation, status: 'CANCELLED' } : reservation,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not cancel.');
    } finally {
      setBusyId(null);
    }
  };

  if (reservations.length === 0) {
    return (
      <div className="rounded-xl2 border border-dashed border-gold/25 p-12 text-center">
        <CalendarDays size={28} className="mx-auto text-gold/60" aria-hidden="true" />
        <p className="mt-4 font-display text-2xl text-cream">No reservations yet</p>
        <p className="mt-2 text-sm text-beige">
          Your evenings at MEKAN 76 will appear here once you book a table.
        </p>
        <Link href="/reservations" className="btn-gold mt-6">
          Book a table <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-cream">
          <AlertCircle size={15} className="text-gold" /> {error}
        </p>
      )}

      {reservations.map((reservation) => {
        const cancellable =
          reservation.status !== 'CANCELLED' && reservation.status !== 'SEATED';
        return (
          <article
            key={reservation.id}
            className="rounded-xl2 border border-gold/15 bg-wine/40 p-5 transition-colors hover:border-gold/30 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[9px] uppercase tracking-[0.28em] text-gold/70">
                  {reference('MK76', reservation.id)}
                </p>
                <h3 className="mt-1.5 font-display text-2xl text-cream">
                  {formatDate(reservation.date)}
                </h3>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] uppercase tracking-[0.18em] ${
                  statusStyles[reservation.status] ?? 'border-cream/20 text-beige'
                }`}
              >
                {reservation.status === 'CONFIRMED' ? (
                  <CheckCircle2 size={11} />
                ) : reservation.status === 'CANCELLED' ? (
                  <X size={11} />
                ) : (
                  <Clock size={11} />
                )}
                {statusLabels[reservation.status] ?? reservation.status}
              </span>
            </div>

            <dl className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-beige">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gold/70" aria-hidden="true" />
                <dt className="sr-only">Time</dt>
                <dd>{reservation.time}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gold/70" aria-hidden="true" />
                <dt className="sr-only">Guests</dt>
                <dd>
                  {reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}
                </dd>
              </div>
            </dl>

            {reservation.requests && (
              <p className="mt-3 rounded-xl border border-cream/8 bg-ink/40 px-4 py-3 text-sm text-beige">
                <span className="text-[9px] uppercase tracking-[0.22em] text-gold/60">Note · </span>
                {reservation.requests}
              </p>
            )}

            {cancellable && (
              <button
                type="button"
                onClick={() => cancel(reservation.id)}
                disabled={busyId === reservation.id}
                className="mt-4 inline-flex min-h-[40px] items-center gap-2 rounded-full border border-cream/15 px-4 text-[10px] uppercase tracking-[0.18em] text-beige transition hover:border-gold/50 hover:text-gold disabled:opacity-50"
              >
                {busyId === reservation.id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <X size={13} />
                )}
                Cancel reservation
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}
