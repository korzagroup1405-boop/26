import Link from 'next/link';
import { Instagram, Facebook, Music2, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Logo from './Logo';
import NewsletterForm from './NewsletterForm';
import type { Content } from '@/lib/content';

const EXPLORE = [
  { href: '/menu', label: 'Menu' },
  { href: '/reservations', label: 'Book a Table' },
  { href: '/about', label: 'About Us' },
  { href: '/amenities', label: 'Amenities' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer({ content }: { content: Content }) {
  const socials = [
    { href: content.instagram, label: 'Instagram', Icon: Instagram },
    { href: content.facebook, label: 'Facebook', Icon: Facebook },
    { href: content.tiktok, label: 'TikTok', Icon: Music2 },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-gold/15 bg-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[680px] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]"
      />
      <div className="container-x relative py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
          <div>
            <Logo size="md" asLink={false} className="items-start" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-beige">
              A Turkish lounge and restaurant devoted to charcoal, cardamom and conversation —
              in the heart of İstanbul since 1976.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`MEKAN 76 on ${label}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/12 text-beige transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold">Explore</h2>
            <ul className="mt-5 space-y-3">
              {EXPLORE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-beige transition hover:text-cream"
                  >
                    <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold">Visit</h2>
            <ul className="mt-5 space-y-4 text-sm text-beige">
              <li className="flex gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold/70" />
                <span>{content.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={15} className="mt-0.5 shrink-0 text-gold/70" />
                <a href={`tel:${content.phone.replace(/[^\d+]/g, '')}`} className="hover:text-cream">
                  {content.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={15} className="mt-0.5 shrink-0 text-gold/70" />
                <a href={`mailto:${content.email}`} className="break-all hover:text-cream">
                  {content.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold">Opening Hours</h2>
            <ul className="mt-5 space-y-3 text-sm text-beige">
              <li className="flex gap-3">
                <Clock size={15} className="mt-0.5 shrink-0 text-gold/70" />
                <span>{content.hours_week}</span>
              </li>
              <li className="flex gap-3">
                <Clock size={15} className="mt-0.5 shrink-0 text-gold/70" />
                <span>{content.hours_weekend}</span>
              </li>
            </ul>
            <h2 className="mt-8 text-[10px] uppercase tracking-[0.3em] text-gold">
              The Evening Letter
            </h2>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/8 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-[11px] uppercase tracking-[0.2em] text-beige/60">
            © {new Date().getFullYear()} MEKAN 76 KAFE NARGILE · All rights reserved
          </p>
          <p className="text-[11px] text-beige/45">
            Demo website — sample menu, prices and contact details are editable.
          </p>
        </div>
      </div>
    </footer>
  );
}
