import { query } from './db';

export const CONTENT_DEFAULTS: Record<string, string> = {
  brand_name: 'MEKAN 76',
  brand_sub: 'KAFE NARGILE',
  hero_eyebrow: 'İstanbul · Est. 1976',
  hero_title: 'The Art of the Long Evening',
  hero_subtitle:
    'Charcoal-kissed flavours, hand-poured coffee and slow-burning shisha — served beneath the amber glow of our İstanbul-inspired salon.',
  hero_note: 'Walk-ins welcome · Reservations recommended after 19:00',
  about_title: 'A house of smoke, spice and slow conversation.',
  about_text:
    'MEKAN 76 KAFE NARGILE was imagined as a refuge from the rush of the city — a room lit by low amber lamps, where copper trays, velvet banquettes and the soft crackle of charcoal set the pace of the evening.',
  about_text_2:
    'Our kitchen draws on the Anatolian table: charcoal-grilled meats, slow mezze and desserts perfumed with pistachio and rose. Our bar pours coffees ground to order and cocktails built around smoke, citrus and spice.',
  address: 'Kordon Caddesi 76, Beşiktaş, İstanbul',
  phone: '+90 (212) 000 76 76',
  email: 'reservations@mekan76.com',
  hours_week: 'Monday – Thursday · 11:00 – 01:00',
  hours_weekend: 'Friday – Sunday · 11:00 – 02:00',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  tiktok: 'https://tiktok.com',
  reservation_note:
    'Tables are held for 20 minutes past the reservation time. For parties larger than 8 guests, please call us directly.',
  menu_note: 'Sample prices shown for demonstration — editable in the owner dashboard.',
};

export type Content = Record<string, string>;

export async function getContent(): Promise<Content> {
  try {
    const rows = await query<{ key: string; value: string }>('SELECT key, value FROM site_content');
    const stored: Content = {};
    for (const row of rows) stored[row.key] = row.value;
    return { ...CONTENT_DEFAULTS, ...stored };
  } catch {
    return { ...CONTENT_DEFAULTS };
  }
}
