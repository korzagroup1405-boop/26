import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ArrowRight, Instagram, Facebook, Music2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import NewsletterForm from '@/components/NewsletterForm';
import { Section } from '@/components/Section';
import { getContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact MEKAN 76 KAFE NARGILE — address, phone, email and opening hours for our İstanbul kafe and nargile lounge.',
};

export default async function ContactPage() {
  const content = await getContent();
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(content.address)}`;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Come and find <span className="italic text-gold">us</span>
          </>
        }
        description="For reservations, private events or simply to ask what is burning on the grill tonight — we are here from late morning until the last ember."
      />

      <Section className="pt-12 sm:pt-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                Icon: MapPin,
                title: 'Address',
                lines: [content.address],
                href: mapsUrl,
                action: 'Open in maps',
                external: true,
              },
              {
                Icon: Phone,
                title: 'Phone',
                lines: [content.phone],
                href: `tel:${content.phone.replace(/[^\d+]/g, '')}`,
                action: 'Call us',
              },
              {
                Icon: Mail,
                title: 'Email',
                lines: [content.email],
                href: `mailto:${content.email}`,
                action: 'Write to us',
              },
              {
                Icon: Clock,
                title: 'Hours',
                lines: [content.hours_week, content.hours_weekend],
              },
            ].map(({ Icon, title, lines, href, action, external }) => (
              <article
                key={title}
                className="flex h-full flex-col rounded-xl2 border border-gold/15 bg-wine/40 p-6 transition-colors duration-500 hover:border-gold/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 text-gold">
                  <Icon size={18} strokeWidth={1.5} />
                </span>
                <h2 className="mt-5 text-[10px] uppercase tracking-[0.28em] text-gold">{title}</h2>
                <div className="mt-2 space-y-1 text-sm leading-relaxed text-cream/90">
                  {lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                {href && action && (
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                    className="mt-auto inline-flex items-center gap-2 pt-5 text-[10px] uppercase tracking-[0.2em] text-beige transition hover:text-gold"
                  >
                    {action} <ArrowRight size={13} />
                  </a>
                )}
              </article>
            ))}
          </div>

          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-xl2 border border-gold/20 bg-wine/50 p-7">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(249,185,35,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(249,185,35,0.35) 1px, transparent 1px)',
                  backgroundSize: '44px 44px',
                  maskImage: 'radial-gradient(70% 70% at 50% 50%, black, transparent)',
                  WebkitMaskImage: 'radial-gradient(70% 70% at 50% 50%, black, transparent)',
                }}
              />
              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">The Location</p>
                <h2 className="mt-3 font-display text-2xl text-cream">
                  Kordon Caddesi, Beşiktaş
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-beige">
                  Two minutes from the ferry pier, behind the plane trees. Look for the amber
                  lanterns and the brass door.
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-outline mt-6 w-full"
                >
                  Get directions <ArrowRight size={14} />
                </a>
              </div>
            </div>

            <div className="rounded-xl2 border border-gold/15 bg-wine/40 p-7">
              <h2 className="font-display text-2xl text-cream">Follow the evening</h2>
              <p className="mt-2 text-sm text-beige">
                New menus, live music nights and late invitations.
              </p>
              <div className="mt-5 flex gap-3">
                {[
                  { href: content.instagram, label: 'Instagram', Icon: Instagram },
                  { href: content.facebook, label: 'Facebook', Icon: Facebook },
                  { href: content.tiktok, label: 'TikTok', Icon: Music2 },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`MEKAN 76 on ${label}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/12 text-beige transition hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
              <h2 className="mt-7 text-[10px] uppercase tracking-[0.28em] text-gold">
                The Evening Letter
              </h2>
              <NewsletterForm />
            </div>

            <div className="rounded-xl2 border border-gold/15 bg-ink/40 p-7">
              <h2 className="font-display text-2xl text-cream">Planning something bigger?</h2>
              <p className="mt-2 text-sm leading-relaxed text-beige">
                Private dining, birthdays and company evenings for up to 60 guests.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={`tel:${content.phone.replace(/[^\d+]/g, '')}`} className="btn-gold">
                  Call events
                </a>
                <Link href="/reservations" className="btn-outline">
                  Book a table
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
