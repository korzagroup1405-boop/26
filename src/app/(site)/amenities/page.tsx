import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Amenities from '@/components/Amenities';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';
import { getGallery } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Amenities',
  description:
    'Outdoor seating, a premium bar, live music and valet parking — the four quiet luxuries of MEKAN 76 KAFE NARGILE.',
};

export default async function AmenitiesPage() {
  const gallery = await getGallery();
  const rituals = [
    {
      title: 'The coffee ritual',
      copy: 'Turkish coffee is ground to order and simmered on hot copper sand, then carried to the table with lokum and a glass of cold water.',
      image: gallery[6]?.image ?? gallery[0]?.image,
      label: 'Kafe',
    },
    {
      title: 'The nargile ritual',
      copy: 'Tobacco is blended in-house, packed by hand and crowned with coconut charcoal — brought to your table with a brass tray and a fresh mouthpiece.',
      image: gallery[3]?.image ?? gallery[0]?.image,
      label: 'Nargile',
    },
    {
      title: 'The charcoal ritual',
      copy: 'Lamb, chicken and kofta meet the grill only after the coals have burned down to a clean, white heat — the reason our mains taste of smoke, not fire.',
      image: gallery[11]?.image ?? gallery[0]?.image,
      label: 'Mangal',
    },
  ].filter((ritual) => Boolean(ritual.image));

  return (
    <>
      <PageHeader
        eyebrow="Amenities"
        title={
          <>
            Four quiet <span className="italic text-gold">luxuries</span>
          </>
        }
        description="The details that turn a dinner into an evening — a terrace under the vines, a bar that knows your order, live oud and a valet who has the car waiting."
      />

      <Section className="pt-12 sm:pt-16">
        <div className="container-x">
          <Amenities />
        </div>
      </Section>

      <Section tone="wine">
        <div className="container-x">
          <SectionHeading
            eyebrow="House Rituals"
            title={
              <>
                Three things we refuse <span className="italic text-gold">to rush</span>
              </>
            }
          />
          <div className="mt-12 space-y-16">
            {rituals.map((ritual, index) => (
              <Reveal key={ritual.title}>
                <div
                  className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                    index % 2 === 1 ? 'lg:[&>figure]:order-2' : ''
                  }`}
                >
                  <figure className="relative overflow-hidden rounded-xl2 border border-gold/15">
                    <img
                      src={ritual.image}
                      alt={ritual.title}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <figcaption className="absolute bottom-4 left-4 rounded-full border border-gold/40 bg-ink/70 px-4 py-1.5 text-[9px] uppercase tracking-[0.28em] text-gold backdrop-blur">
                      {ritual.label}
                    </figcaption>
                  </figure>
                  <div>
                    <h3 className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)] leading-tight text-cream">
                      {ritual.title}
                    </h3>
                    <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-beige">
                      {ritual.copy}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-4">
            <Link href="/reservations" className="btn-gold">
              Book a table <ArrowRight size={15} />
            </Link>
            <Link href="/gallery" className="btn-outline">
              See the rooms
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
