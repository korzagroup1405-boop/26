import Link from 'next/link';
import { ArrowRight, Phone, Clock, MapPin, Quote } from 'lucide-react';
import Hero from '@/components/Hero';
import { Section, SectionHeading } from '@/components/Section';
import MenuExplorer from '@/components/MenuExplorer';
import Amenities from '@/components/Amenities';
import GalleryGrid from '@/components/GalleryGrid';
import ReservationForm from '@/components/ReservationForm';
import Reveal from '@/components/Reveal';
import { getContent } from '@/lib/content';
import { getGallery, getMenuItems, HERO_IMAGE, ABOUT_IMAGE } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth';

export default async function HomePage() {
  const [content, items, gallery, user] = await Promise.all([
    getContent(),
    getMenuItems(),
    getGallery(),
    getCurrentUser(),
  ]);

  return (
    <>
      <Hero content={content} image={HERO_IMAGE} />

      {/* Signature band */}
      <div className="relative border-y border-gold/12 bg-wine/30">
        <div className="container-x grid grid-cols-2 divide-gold/10 py-7 sm:grid-cols-4 sm:divide-x">
          {[
            ['Est. 1976', 'İstanbul'],
            ['6 chapters', 'Kitchen & bar'],
            ['48 labels', 'Premium bar'],
            ['Till 02:00', 'Fri – Sun'],
          ].map(([value, label]) => (
            <div key={value} className="px-2 py-2 text-center sm:px-6">
              <p className="font-display text-xl text-cream sm:text-2xl">{value}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.26em] text-gold/70">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <Section id="menu-preview">
        <div className="container-x">
          <SectionHeading
            eyebrow="The Menu"
            title={
              <>
                A gallery of taste, <span className="italic text-gold">poured and plated</span>
              </>
            }
            description="Six chapters — from smoke-kissed mains to cardamom coffee and gold-rimmed cocktails. Filter by chapter or search for a craving."
            action={
              <Link href="/menu" className="btn-outline hidden md:inline-flex">
                Full menu <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="mt-12">
            <MenuExplorer items={items} limit={6} note={content.menu_note} />
          </div>
        </div>
      </Section>

      {/* About */}
      <Section tone="wine" id="about">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative mx-auto max-w-md lg:mx-0">
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[40px] border border-gold/15 sm:-inset-6"
              />
              <img
                src={ABOUT_IMAGE}
                alt="A candlelit table set for two at MEKAN 76 KAFE NARGILE"
                className="arch relative aspect-[4/5] w-full rounded-b-xl2 object-cover shadow-soft"
                loading="lazy"
              />
              <div className="absolute -bottom-6 left-4 rounded-2xl border border-gold/30 bg-ink/90 px-5 py-4 backdrop-blur sm:left-8">
                <p className="font-display text-2xl leading-none text-gold">1976</p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-beige/70">
                  Since · İstanbul
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <span className="eyebrow">About Us</span>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.3rem)] font-light leading-[1.08] text-cream text-balance">
              {content.about_title}
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-beige sm:text-base">
              {content.about_text}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-beige/80 sm:text-base">
              {content.about_text_2}
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                'Charcoal grill, fired daily',
                'Coffee ground to order',
                'Hand-blended shisha',
                'Terrace open year-round',
              ].map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-cream/85">
                  <span aria-hidden="true" className="text-[8px] text-gold">
                    ◆
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/about" className="btn-gold">
                Learn More <ArrowRight size={15} />
              </Link>
              <Link
                href="/gallery"
                className="text-[11px] uppercase tracking-[0.24em] text-cream/70 underline-offset-4 transition hover:text-gold hover:underline"
              >
                See the rooms
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Amenities */}
      <Section>
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="Amenities"
            title={
              <>
                Everything for a <span className="italic text-gold">longer evening</span>
              </>
            }
            description="Four quiet luxuries that make the night linger — from the terrace to the valet stand."
          />
          <div className="mt-12">
            <Amenities />
          </div>
        </div>
      </Section>

      {/* Gallery */}
      <Section tone="wine">
        <div className="container-x">
          <SectionHeading
            eyebrow="Gallery"
            title={
              <>
                Low light, <span className="italic text-gold">long nights</span>
              </>
            }
            description="A look inside the salon — copper, velvet, ember and candlelight."
            action={
              <Link href="/gallery" className="btn-outline hidden md:inline-flex">
                Full gallery <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="mt-12">
            <GalleryGrid images={gallery.slice(0, 6)} />
          </div>
          <div className="mt-8 flex justify-center md:hidden">
            <Link href="/gallery" className="btn-outline w-full sm:w-auto">
              Full gallery <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </Section>

      {/* Reservation */}
      <Section id="reserve">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <span className="eyebrow">Book a Table</span>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,4.6vw,3.5rem)] font-light leading-[1.05] text-cream text-balance">
              Your table is <span className="italic text-gold">waiting</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-beige">
              Choose a date, pick a sitting and tell us who is coming. We keep a handful of tables
              for walk-ins, but the terrace and window seats go first.
            </p>

            <figure className="mt-9 rounded-xl2 border border-gold/15 bg-wine/40 p-6">
              <Quote size={18} className="text-gold/60" aria-hidden="true" />
              <blockquote className="mt-3 font-display text-xl italic leading-relaxed text-cream/90">
                “The kind of room where nobody looks at the time.”
              </blockquote>
              <figcaption className="mt-4 text-[9px] uppercase tracking-[0.28em] text-beige/60">
                The Evening Review · Demo quote
              </figcaption>
            </figure>

            <dl className="mt-9 space-y-4 text-sm text-beige">
              <div className="flex items-start gap-3">
                <Clock size={15} className="mt-0.5 shrink-0 text-gold/70" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Opening hours</dt>
                  <dd>{content.hours_week}</dd>
                  <dd>{content.hours_weekend}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold/70" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Address</dt>
                  <dd>{content.address}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={15} className="mt-0.5 shrink-0 text-gold/70" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a
                      href={`tel:${content.phone.replace(/[^\d+]/g, '')}`}
                      className="transition hover:text-gold"
                    >
                      {content.phone}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <ReservationForm
            note={content.reservation_note}
            signedIn={Boolean(user)}
            defaults={{ name: user?.name, email: user?.email, phone: user?.phone ?? undefined }}
          />
        </div>
      </Section>
    </>
  );
}
