import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Amenities from '@/components/Amenities';
import { Section, SectionHeading } from '@/components/Section';
import Reveal from '@/components/Reveal';
import { getContent } from '@/lib/content';
import { ABOUT_IMAGE, LOUNGE_IMAGE } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'The story of MEKAN 76 KAFE NARGILE — a Turkish kafe and nargile lounge in İstanbul, devoted to charcoal, cardamom and conversation since 1976.',
};

const TIMELINE = [
  ['1976', 'The first room', 'A twelve-table kafe opens off Kordon Caddesi, serving coffee and nargile to the neighbourhood.'],
  ['1998', 'The grill arrives', 'The charcoal mangal is installed at the back of the salon and the kitchen begins to take centre stage.'],
  ['2014', 'The brass bar', 'A copper-topped bar is added, and the first house cocktails are poured.'],
  ['Today', 'The long evening', 'Three rooms, a terrace and a bar — still lit by amber lamps, still in no hurry.'],
];

export default async function AboutPage() {
  const content = await getContent();

  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title={
          <>
            Since 1976, <span className="italic text-gold">in no hurry</span>
          </>
        }
        description="A Turkish kafe and nargile lounge in the heart of İstanbul — built for the kind of evening that refuses to end."
        image={ABOUT_IMAGE}
      />

      <Section className="pt-12 sm:pt-16">
        <div className="container-x grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <div className="relative">
              <div aria-hidden="true" className="absolute -inset-4 rounded-[40px] border border-gold/15" />
              <img
                src={LOUNGE_IMAGE}
                alt="The terrace at MEKAN 76 KAFE NARGILE, lit by low amber lamps"
                className="relative aspect-[4/5] w-full rounded-xl2 object-cover shadow-soft"
                loading="lazy"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <span className="eyebrow">The House</span>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.08] text-cream text-balance">
              {content.about_title}
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-beige sm:text-base">
              {content.about_text}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-beige/85 sm:text-base">
              {content.about_text_2}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-beige/85 sm:text-base">
              Nothing here is designed to be finished quickly. The coals are lit early, the coffee
              is ground to order, and the music is kept low enough for a conversation to last
              through the night.
            </p>

            <div className="mt-9 grid grid-cols-3 gap-4 border-t border-gold/15 pt-7">
              {[
                ['1976', 'Established'],
                ['3', 'Rooms & terrace'],
                ['60', 'Seats for events'],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="font-display text-3xl text-gold">{value}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-beige/60">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="wine">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="Milestones"
            title={
              <>
                Four rooms, <span className="italic text-gold">one long evening</span>
              </>
            }
          />
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map(([year, title, copy], index) => (
              <Reveal key={year} delay={index * 100}>
                <li className="relative h-full rounded-xl2 border border-gold/15 bg-ink/40 p-6">
                  <span className="font-display text-2xl text-gold">{year}</span>
                  <span aria-hidden="true" className="mt-3 block h-px w-8 bg-gold/40" />
                  <h3 className="mt-4 font-display text-xl text-cream">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-beige">{copy}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Section>
        <div className="container-x">
          <SectionHeading
            eyebrow="The Details"
            title={
              <>
                What makes the room <span className="italic text-gold">feel like this</span>
              </>
            }
            description="Four amenities, chosen because they let an evening breathe."
          />
          <div className="mt-12">
            <Amenities />
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/reservations" className="btn-gold">
              Book a table <ArrowRight size={15} />
            </Link>
            <Link href="/menu" className="btn-outline">
              Explore the menu
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
