import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import GalleryGrid from '@/components/GalleryGrid';
import { Section } from '@/components/Section';
import { getGallery } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Inside MEKAN 76 KAFE NARGILE — the amber salon, the brass bar, the terrace and the ember of a slow evening.',
};

export default async function GalleryPage() {
  const images = await getGallery();

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title={
          <>
            The rooms, <span className="italic text-gold">after dark</span>
          </>
        }
        description="Velvet, copper and candlelight. Click any frame to open it fullscreen — use the arrow keys to move through the evening."
      />
      <Section className="pt-12 sm:pt-16">
        <div className="container-x">
          <GalleryGrid images={images} />
        </div>
      </Section>
    </>
  );
}
