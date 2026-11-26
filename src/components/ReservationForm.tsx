'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, CalendarDays, Check, Loader2, Users } from 'lucide-react';
import { TIME_SLOTS } from '@/lib/types';
import { cx, formatDate, reference } from '@/lib/format';

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'date' | 'time' | 'guests', string>>;

type Result = {
  id: number;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
};

const tomorrow = () => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function ReservationForm({
  note,
  signedIn,
  defaults,
}: {
  note: string;
  signedIn: boolean;
  defaults?: { name?: string; email?: string; phone?: string };
}) {
  const [form, setForm] = useState({
    name: defaults?.name ?? '',
    email: defaults?.email ?? '',
    phone: defaults?.phone ?? '',
    date: tomorrow(),
    time: '20:00',
    guests: '2',
    requests: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [booked, setBooked] = useState<Record<string, number>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!form.date) return;
    setLoadingSlots(true);
    fetch(`/api/availability?date=${form.date}`)
      .then((response) => (response.ok ? response.json() : { slots: {} }))
      .then((data) => {
        if (!cancelled) setBooked(data.slots ?? {});
      })
      .catch(() => {
        if (!cancelled) setBooked({});
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [form.date]);

  const capacity = 50;
  const remaining = (slot: string) => Math.max(0, capacity - (booked[slot] ?? 0));

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setServerError(null);
  };

  const validate = () => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a reachable phone number.';
    if (!form.date) next.date = 'Choose a date.';
    else if (form.date < todayIso()) next.date = 'Choose today or a future date.';
    if (!form.time) next.time = 'Choose a time.';
    const guests = Number(form.guests);
    if (!Number.isFinite(guests) || guests < 1) next.guests = 'At least one guest is required.';
    if (form.time && remaining(form.time) < guests) {
      next.time = 'That sitting is full — please choose another time.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setStatus('submitting');
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, guests: Number(form.guests) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? 'We could not save your reservation.');
      setResult(data.reservation);
      setStatus('done');
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong.');
      setStatus('idle');
    }
  };

  if (status === 'done' && result) {
    return (
      <div className="relative overflow-hidden rounded-xl3 border border-gold/30 bg-wine/70 p-8 text-center shadow-soft backdrop-blur sm:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gold/20 blur-[80px]"
        />
        <div className="relative">
          <span className="mx-auto flex h-24 w-24 animate-seal items-center justify-center rounded-full border border-gold/60 bg-gold/10">
            <span className="flex h-16 w-16 flex-col items-center justify-center rounded-full border border-gold/40">
              <span className="font-display text-2xl leading-none text-gold">76</span>
              <span className="mt-0.5 text-[6px] uppercase tracking-[0.3em] text-gold/80">Mekan</span>
            </span>
          </span>
          <p className="mt-7 text-[10px] uppercase tracking-[0.34em] text-gold">
            Your invitation
          </p>
          <h3 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-tight text-cream">
            Your table is requested
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-beige">
            Thank you, {result.name.split(' ')[0]}. We have received your request and will confirm
            it by email shortly.
          </p>

          <dl className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gold/20 bg-gold/15 text-left">
            {[
              ['Reference', reference('MK76', result.id)],
              ['Date', formatDate(result.date)],
              ['Time', result.time],
              ['Guests', `${result.guests} ${result.guests === 1 ? 'guest' : 'guests'}`],
            ].map(([label, value]) => (
              <div key={label} className="bg-ink/80 px-4 py-4">
                <dt className="text-[9px] uppercase tracking-[0.24em] text-beige/60">{label}</dt>
                <dd className="mt-1 text-sm text-cream">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {signedIn && (
              <Link href="/account" className="btn-gold">
                View my reservations
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setStatus('idle');
                setForm((current) => ({ ...current, requests: '' }));
              }}
              className="btn-outline"
            >
              Book another table
            </button>
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-beige/50">{note}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="relative overflow-hidden rounded-xl3 border border-gold/20 bg-wine/55 p-6 shadow-soft backdrop-blur-md sm:p-8"
    >
      <div aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-gold/40" />

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Reservation</p>
          <h3 className="mt-2 font-display text-[26px] leading-none text-cream">
            Reserve your evening
          </h3>
        </div>
        <span className="hidden h-11 w-11 items-center justify-center rounded-full border border-gold/25 text-gold sm:flex">
          <CalendarDays size={18} />
        </span>
      </div>

      <div className="mt-7 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={errors.name} htmlFor="res-name">
            <input
              id="res-name"
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              className="field"
              placeholder="Your name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'res-name-error' : undefined}
            />
          </Field>
          <Field label="Email" error={errors.email} htmlFor="res-email" errorId="res-email-error">
            <input
              id="res-email"
              type="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              className="field"
              placeholder="you@email.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'res-email-error' : undefined}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" error={errors.phone} htmlFor="res-phone" errorId="res-phone-error">
            <input
              id="res-phone"
              type="tel"
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
              className="field"
              placeholder="+90 5xx xxx xx xx"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'res-phone-error' : undefined}
            />
          </Field>
          <Field label="Guests" error={errors.guests} htmlFor="res-guests" errorId="res-guests-error">
            <div className="relative">
              <select
                id="res-guests"
                value={form.guests}
                onChange={(event) => update('guests', event.target.value)}
                className="field appearance-none pr-10"
                aria-invalid={Boolean(errors.guests)}
              >
                {Array.from({ length: 8 }, (_, index) => index + 1).map((value) => (
                  <option key={value} value={value} className="bg-ink text-cream">
                    {value} {value === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
              <Users
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gold/70"
              />
            </div>
          </Field>
        </div>

        <Field label="Date" error={errors.date} htmlFor="res-date" errorId="res-date-error">
          <input
            id="res-date"
            type="date"
            min={todayIso()}
            value={form.date}
            onChange={(event) => update('date', event.target.value)}
            className="field"
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'res-date-error' : undefined}
          />
        </Field>

        <fieldset>
          <legend className="label">
            Time {loadingSlots && <span className="normal-case tracking-normal text-beige/50">· checking availability…</span>}
          </legend>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Reservation time">
            {TIME_SLOTS.map((slot) => {
              const left = remaining(slot);
              const full = left <= 0;
              const selected = form.time === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={full}
                  onClick={() => update('time', slot)}
                  className={cx(
                    'flex min-h-[52px] flex-col items-center justify-center rounded-xl border text-[13px] transition-all duration-300',
                    selected
                      ? 'border-gold bg-gold text-ink'
                      : 'border-cream/12 text-cream hover:border-gold/50',
                    full && 'cursor-not-allowed border-cream/5 text-beige/30 line-through',
                  )}
                >
                  <span className="font-medium tabular-nums">{slot}</span>
                  <span
                    className={cx(
                      'mt-0.5 text-[8px] uppercase tracking-[0.14em]',
                      selected ? 'text-ink/70' : 'text-beige/50',
                    )}
                  >
                    {full ? 'Full' : `${left} seats`}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.time && <FieldError id="res-time-error" message={errors.time} />}
        </fieldset>

        <Field label="Special requests" htmlFor="res-requests" optional>
          <textarea
            id="res-requests"
            value={form.requests}
            onChange={(event) => update('requests', event.target.value)}
            rows={3}
            className="field resize-none"
            placeholder="Anniversary, terrace table, shisha preference…"
          />
        </Field>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-cream"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-gold" />
          <span>{serverError}</span>
        </div>
      )}

      <button type="submit" disabled={status === 'submitting'} className="btn-gold mt-6 w-full disabled:opacity-60">
        {status === 'submitting' ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Sending request
          </>
        ) : (
          <>
            Request my table <ArrowRight size={15} />
          </>
        )}
      </button>
      <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-beige/50">
        <Check size={13} className="mt-0.5 shrink-0 text-gold/60" aria-hidden="true" />
        {note}
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  errorId,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  errorId?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
        {optional && <span className="ml-1 normal-case tracking-normal text-beige/40">(optional)</span>}
      </label>
      {children}
      {error && <FieldError id={errorId ?? `${htmlFor}-error`} message={error} />}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-[11px] text-gold" role="alert">
      <AlertCircle size={12} aria-hidden="true" />
      {message}
    </p>
  );
}
