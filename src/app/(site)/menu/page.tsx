import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import MenuExplorer from '@/components/MenuExplorer';
import { Section } from '@/components/Section';
import { getContent } from '@/lib/content';
import { getMenuItems, LOUNGE_IMAGE } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'Explore the MEKAN 76 KAFE NARGILE menu — signature drinks, coffee, fresh juices, desserts, main courses and appetizers.',
};

export default async function MenuPage() {
  const [items, content] = await Promise.all([getMenuItems(), getContent()]);

  return (
    <>
      <PageHeader
        eyebrow="Kitchen & Bar"
        title={
          <>
            Six chapters of <span className="italic text-gold">smoke and gold</span>
          </>
        }
        description="Charcoal-grilled mains, slow mezze, cardamom coffee and cocktails built around ember, citrus and spice. Filter by chapter, search for a craving, and build your tray."
        image={LOUNGE_IMAGE}
      />

      <Section className="pt-14 sm:pt-16">
        <div className="container-x">
          <MenuExplorer items={items} note={content.menu_note} />
        </div>
      </Section>

      <Section tone="wine" className="py-16 sm:py-20">
        <div className="container-x grid gap-8 sm:grid-cols-3">
          {[
            ['01', 'Build your tray', 'Add dishes and drinks to your order as you browse.'],
            ['02', 'Place the order', 'Leave a name and number — no payment is taken online.'],
            ['03', 'We take it from here', 'Our team confirms by phone and prepares everything to order.'],
          ].map(([step, title, copy]) => (
            <div key={step} className="flex gap-4">
              <span className="font-display text-3xl text-gold/40">{step}</span>
              <div>
                <h2 className="font-display text-xl text-cream">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-beige">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
