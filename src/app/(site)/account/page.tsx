import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Mail, Phone, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import MyReservations from '@/components/account/MyReservations';
import { Section } from '@/components/Section';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { formatDate } from '@/lib/format';
import type { Reservation } from '@/lib/types';

export const metadata: Metadata = { title: 'My Account' };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/account');

  const reservations = await query<Reservation>(
    `SELECT id, name, email, phone, to_char(date, 'YYYY-MM-DD') AS date, time, guests,
            requests, status, user_id, created_at
     FROM reservations WHERE user_id = $1 ORDER BY date DESC, time DESC`,
    [user.id],
  );

  return (
    <>
      <PageHeader
        eyebrow="My Account"
        title={
          <>
            Welcome back, <span className="italic text-gold">{user.name.split(' ')[0]}</span>
          </>
        }
        description="Your reservations, details and the evenings still to come."
      />

      <Section className="pt-12 sm:pt-16">
        <div className="container-x grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
          <aside className="space-y-4">
            <div className="rounded-xl2 border border-gold/20 bg-wine/50 p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-display text-xl text-gold">
                  {user.name
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-xl text-cream">{user.name}</p>
                  <p className="text-[9px] uppercase tracking-[0.24em] text-gold/70">
                    {user.role === 'ADMIN' ? 'Owner' : 'Guest'}
                  </p>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-beige">
                <li className="flex items-center gap-3">
                  <Mail size={14} className="shrink-0 text-gold/70" aria-hidden="true" />
                  <span className="truncate">{user.email}</span>
                </li>
                {user.phone && (
                  <li className="flex items-center gap-3">
                    <Phone size={14} className="shrink-0 text-gold/70" aria-hidden="true" />
                    <span>{user.phone}</span>
                  </li>
                )}
                <li className="flex items-center gap-3">
                  <ShieldCheck size={14} className="shrink-0 text-gold/70" aria-hidden="true" />
                  <span>Member since {formatDate(user.created_at)}</span>
                </li>
              </ul>

              {user.role === 'ADMIN' && (
                <Link href="/admin" className="btn-gold mt-6 w-full">
                  Owner dashboard <ArrowRight size={14} />
                </Link>
              )}
              <Link href="/reservations" className="btn-outline mt-3 w-full">
                Book a new table
              </Link>
            </div>

            <div className="rounded-xl2 border border-gold/15 bg-ink/40 p-6">
              <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Need to change something?</p>
              <p className="mt-2 text-sm leading-relaxed text-beige">
                Cancel here, or call the house and we will adjust the table for you.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-beige transition hover:text-gold"
              >
                Contact us <ArrowRight size={13} />
              </Link>
            </div>
          </aside>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-3xl text-cream">Your reservations</h2>
              <span className="text-[10px] uppercase tracking-[0.22em] text-beige/60">
                {reservations.length} total
              </span>
            </div>
            <div className="mt-6">
              <MyReservations initial={reservations} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
