import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/cart/CartProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://mekan76.com'),
  title: {
    default: 'MEKAN 76 KAFE NARGILE — Luxury Turkish Lounge & Restaurant',
    template: '%s · MEKAN 76 KAFE NARGILE',
  },
  description:
    'MEKAN 76 KAFE NARGILE is a luxury Turkish kafe and nargile lounge in İstanbul — charcoal grill, hand-poured coffee, signature cocktails and slow-burning shisha beneath amber light.',
  keywords: [
    'MEKAN 76',
    'KAFE NARGILE',
    'Turkish restaurant',
    'hookah lounge',
    'nargile',
    'İstanbul lounge',
    'luxury restaurant',
    'shisha',
  ],
  applicationName: 'MEKAN 76 KAFE NARGILE',
  authors: [{ name: 'MEKAN 76 KAFE NARGILE' }],
  openGraph: {
    type: 'website',
    siteName: 'MEKAN 76 KAFE NARGILE',
    title: 'MEKAN 76 KAFE NARGILE — Luxury Turkish Lounge & Restaurant',
    description:
      'Charcoal-kissed flavours, hand-poured coffee and slow-burning shisha — an İstanbul-inspired lounge since 1976.',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MEKAN 76 KAFE NARGILE',
    description:
      'Charcoal-kissed flavours, hand-poured coffee and slow-burning shisha — an İstanbul-inspired lounge since 1976.',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'MEKAN 76 KAFE NARGILE',
  servesCuisine: ['Turkish', 'Mediterranean', 'Middle Eastern'],
  priceRange: '₺₺₺',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kordon Caddesi 76',
    addressLocality: 'Beşiktaş',
    addressRegion: 'İstanbul',
    addressCountry: 'TR',
  },
  telephone: '+90-212-000-76-76',
  openingHours: ['Mo-Th 11:00-01:00', 'Fr-Su 11:00-02:00'],
  acceptsReservations: 'True',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
