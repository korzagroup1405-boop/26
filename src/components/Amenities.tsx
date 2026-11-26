import { Umbrella, Martini, Music4, CarFront } from 'lucide-react';
import Reveal from './Reveal';

export const AMENITIES = [
  {
    title: 'Outdoor Seating',
    description:
      'A candlelit terrace under vine and string light — open from the first coffee to the last ember.',
    Icon: Umbrella,
    note: 'Garden & terrace',
  },
  {
    title: 'Premium Bar',
    description:
      'Small-batch spirits, house infusions and a bartender who remembers exactly how you take it.',
    Icon: Martini,
    note: '48 labels',
  },
  {
    title: 'Live Music',
    description:
      'Oud, percussion and jazz trios drift through the salon from Thursday to Saturday, from 21:00.',
    Icon: Music4,
    note: 'Thu – Sat',
  },
  {
    title: 'Valet Parking',
    description:
      'Hand your keys to the door and step straight into the evening. Complimentary for dinner guests.',
    Icon: CarFront,
    note: 'Complimentary',
  },
];

export default function Amenities({ withHeading = false }: { withHeading?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {AMENITIES.map(({ title, description, Icon, note }, index) => (
        <Reveal key={title} delay={index * 90}>
          <article className="group relative h-full overflow-hidden rounded-xl2 card-surface p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-gold">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold/5 blur-2xl transition-opacity duration-500 group-hover:bg-gold/15"
            />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold/10">
              <Icon size={22} strokeWidth={1.4} />
            </span>
            <h3 className="mt-6 font-display text-2xl text-cream">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-beige">{description}</p>
            <span className="mt-6 inline-block text-[9px] uppercase tracking-[0.28em] text-gold/70">
              {note}
            </span>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
