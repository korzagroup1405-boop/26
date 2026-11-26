import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, MapPin, Phone, Mail, ArrowRight, Sparkles } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ReservationForm from '@/components/ReservationForm';
import { Section } from '@/components/Section';
import { getContent } from '@/lib/content';
import { getCurrentUser } from '@/lib/auth';
import { ABOUT_IMAGE } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Book a Table',
  description:
    'Reserve a table at MEKAN 76 KAFE NARGILE — choose your date, pick a sitting and tell us who is coming.',
};

export default async function ReservationsPage() {
  const [content, user] = await Promise.all([getContent(), getCurrentUser()]);

  return (
    <>
      <PageHeader
        eyebrow="Reservations"
        title={
          <>
            Reserve <span className="italic text-gold">your evening</span>
          </>
        }
        description="Choose a date, pick a sitting and tell us who is coming. We hold a handful of tables for walk-ins, but the terrace and window seats go first."
        image={ABOUT_IMAGE}
      />

      <Section className="pt-12 sm:pt-16">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <ReservationForm
            note={content.reservation_note}
            signedIn={Boolean(user)}
            defaults={{ name: user?.name, email: user?.email, phone: user?.phone ?? undefined }}
          />

          <div className="space-y-5">
            <div className="rounded-xl2 border border-gold/15 bg-wine/40 p-7">
              <h2 className="flex items-center gap-3 font-display text-2xl text-cream">
                <Clock size={18} className="text-gold" aria-hidden="true" />
                Opening hours
              </h2>
              <dl className="mt-5 space-y-3 text-sm text-beige">
                <div className="flex justify-between gap-4 border-b border-cream/8 pb-3">
                  <dt>Monday – Thursday</dt>
                  <dd className="text-cream/90">11:00 – 01:00</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-cream/8 pb-3">
                  <dt>Friday – Sunday</dt>
                  <dd className="text-cream/90">11:00 – 02:00</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Kitchen last orders</dt>
                  <dd className="text-cream/90">23:30</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl2 border border-gold/15 bg-wine/40 p-7">
              <h2 className="font-display text-2xl text-cream">Find us</h2>
              <ul className="mt-5 space-y-4 text-sm text-beige">
                <li className="flex gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-gold/70" aria-hidden="true" />
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(content.address)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="transition hover:text-gold"
                  >
                    {content.address}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Phone size={16} className="mt-0.5 shrink-0 text-gold/70" aria-hidden="true" />
                  <a
                    href={`tel:${content.phone.replace(/[^\d+]/g, '')}`}
                    className="transition hover:text-gold"
                  >
                    {content.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail size={16} className="mt-0.5 shrink-0 text-gold/70" aria-hidden="true" />
                  <a href={`mailto:${content.email}`} className="break-all transition hover:text-gold">
                    {content.email}
                  </a>
                </li>
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-xl2 border border-gold/25 bg-[linear-gradient(140deg,rgba(249,185,35,0.12),rgba(53,8,13,0.9))] p-7">
              <Sparkles size={18} className="text-gold" aria-hidden="true" />
              <h2 className="mt-3 font-display text-2xl text-cream">Private events</h2>
              <p className="mt-2 text-sm leading-relaxed text-beige">
                The salon can be reserved for birthdays, engagements and company evenings of up to
                60 guests. Tell us the date and we will design the night with you.
              </p>
              <Link href="/contact" className="btn-outline mt-5 w-full">
                Enquire about events <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
