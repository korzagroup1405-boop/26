#!/usr/bin/env node
/**
 * Idempotent database bootstrap for MEKAN 76 KAFE NARGILE.
 * Creates the schema (if missing) and seeds demo content without
 * overwriting anything the owner has edited in the dashboard.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const connectionString =
  process.env.DATABASE_URL || 'postgres://mekan76:mekan76@db:5432/mekan76';

const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const CONTENT = {
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

const MENU = [
  // Signature Drinks
  {
    name: 'Mekan 76 Signature',
    description: 'Smoked bourbon, black fig, cardamom honey and a whisper of rose water.',
    price: 420,
    category: 'Signature Drinks',
    image: img('1514362545857-3bc16c4c7d1b'),
    badge: 'House Icon',
    featured: true,
  },
  {
    name: 'Ember Old Fashioned',
    description: 'Aged whiskey stirred over charred orange peel and clove bitters.',
    price: 380,
    category: 'Signature Drinks',
    image: img('1536935338788-846bb9981813'),
    badge: null,
    featured: true,
  },
  {
    name: 'Gilded Rose Spritz',
    description: 'Prosecco, pomegranate, elderflower and an edible gold rim.',
    price: 340,
    category: 'Signature Drinks',
    image: img('1544145945-f90425340c7e'),
    badge: null,
    featured: false,
  },
  {
    name: 'Bosphorus Negroni',
    description: 'Gin, bitter orange, vermouth and a hand-cut Turkish delight garnish.',
    price: 360,
    category: 'Signature Drinks',
    image: img('1551024709-8f23befc6f87'),
    badge: null,
    featured: false,
  },
  // Coffee
  {
    name: 'Mekan Turkish Coffee',
    description: 'Stone-ground arabica simmered on copper sand, served with lokum.',
    price: 120,
    category: 'Coffee',
    image: img('1495474472287-4d71bcdd2085'),
    badge: 'Ritual',
    featured: true,
  },
  {
    name: 'Velvet Flat White',
    description: 'Double ristretto, silk-steamed milk, a dusting of cocoa nib.',
    price: 140,
    category: 'Coffee',
    image: img('1509042239860-f550ce710b93'),
    badge: null,
    featured: false,
  },
  {
    name: 'Cardamom Latte',
    description: 'Slow-pulled espresso, green cardamom and wildflower honey.',
    price: 155,
    category: 'Coffee',
    image: img('1442512595331-e89e73853f31'),
    badge: null,
    featured: false,
  },
  {
    name: 'Espresso Noir',
    description: 'Our darkest roast — cocoa, dried fig, a long bittersweet finish.',
    price: 110,
    category: 'Coffee',
    image: img('1461023058943-07fcbe16d735'),
    badge: null,
    featured: false,
  },
  // Fresh Juices
  {
    name: 'Pomegranate Press',
    description: 'Cold-pressed pomegranate, lime and a touch of orange blossom.',
    price: 170,
    category: 'Fresh Juices',
    image: img('1600271886742-f049cd451bba'),
    badge: 'Cold Pressed',
    featured: true,
  },
  {
    name: 'Citrus Sunrise',
    description: 'Blood orange, grapefruit and ginger over crushed ice.',
    price: 160,
    category: 'Fresh Juices',
    image: img('1613478223719-2ab802602423'),
    badge: null,
    featured: false,
  },
  {
    name: 'Green Garden',
    description: 'Cucumber, green apple, mint and celery — clean and bright.',
    price: 165,
    category: 'Fresh Juices',
    image: img('1622597467836-f3285f2131b8'),
    badge: null,
    featured: false,
  },
  {
    name: 'Mango Silk',
    description: 'Alphonso mango, coconut cream and lime zest.',
    price: 180,
    category: 'Fresh Juices',
    image: img('1553530666-ba11a7da3888'),
    badge: null,
    featured: false,
  },
  // Desserts
  {
    name: 'Pistachio Baklava',
    description: 'Forty layers of filo, Antep pistachio and warm honey syrup.',
    price: 210,
    category: 'Desserts',
    image: img('1519676867240-f03562e64548'),
    badge: 'House Favourite',
    featured: true,
  },
  {
    name: 'Rose & Semolina Cake',
    description: 'Soaked in rose syrup, served with clotted kaymak cream.',
    price: 190,
    category: 'Desserts',
    image: img('1563805042-7684c019e1cb'),
    badge: null,
    featured: false,
  },
  {
    name: 'Dark Chocolate Künefe',
    description: 'Crisp kadayif, molten chocolate and a scoop of mastic ice cream.',
    price: 230,
    category: 'Desserts',
    image: img('1578985545062-69928b1d9587'),
    badge: null,
    featured: false,
  },
  {
    name: 'Fig & Honey Cheesecake',
    description: 'Baked cheesecake, roasted fig and pine honey.',
    price: 200,
    category: 'Desserts',
    image: img('1551024506-0bccd828d307'),
    badge: null,
    featured: false,
  },
  // Main Courses
  {
    name: 'Charcoal Lamb Kebab',
    description: 'Adana-spiced lamb over charcoal, sumac onions and grilled pide.',
    price: 640,
    category: 'Main Courses',
    image: img('1544025162-d76694265947'),
    badge: 'Chef’s Table',
    featured: true,
  },
  {
    name: 'Sultan’s Mixed Grill',
    description: 'Lamb chops, chicken shish and kofta with smoked aubergine.',
    price: 780,
    category: 'Main Courses',
    image: img('1529042410759-befb1204b468'),
    badge: null,
    featured: true,
  },
  {
    name: 'Ottoman Chicken Shish',
    description: 'Yoghurt-marinated chicken, charred peppers and saffron rice.',
    price: 520,
    category: 'Main Courses',
    image: img('1600891964092-4316c288032e'),
    badge: null,
    featured: false,
  },
  {
    name: 'Saffron Rice & Lamb',
    description: 'Slow-braised lamb shoulder, barberry rice and toasted almonds.',
    price: 590,
    category: 'Main Courses',
    image: img('1512058564366-18510be2db19'),
    badge: null,
    featured: false,
  },
  // Appetizers
  {
    name: 'Mezze Trilogy',
    description: 'Hummus, muhammara and labneh with warm sesame pide.',
    price: 260,
    category: 'Appetizers',
    image: img('1546069901-ba9599a7e63c'),
    badge: 'Vegetarian',
    featured: true,
  },
  {
    name: 'Grilled Halloumi',
    description: 'Charred halloumi, fig jam, mint and pistachio crumb.',
    price: 240,
    category: 'Appetizers',
    image: img('1555939594-58d7cb561ad1'),
    badge: null,
    featured: false,
  },
  {
    name: 'Hummus & Warm Pide',
    description: 'Whipped chickpea, tahini, olive oil and cumin butter.',
    price: 190,
    category: 'Appetizers',
    image: img('1572695157366-5e585ab2b69f'),
    badge: 'Vegetarian',
    featured: false,
  },
  {
    name: 'Crisp Calamari',
    description: 'Semolina-crusted calamari, lemon aioli and smoked paprika.',
    price: 280,
    category: 'Appetizers',
    image: img('1599487488170-d11ec9c172f0'),
    badge: null,
    featured: false,
  },
];

const GALLERY = [
  { title: 'The Amber Salon', category: 'Interior', image: img('1552566626-52f8b828add9', 1400) },
  { title: 'Table for Two', category: 'Interior', image: img('1414235077428-338989a2e8c0', 1400) },
  { title: 'Embers & Smoke', category: 'Shisha', image: img('1635547821500-77542481940c', 1400) },
  { title: 'Ornate Hookahs', category: 'Shisha', image: img('1763637675322-a8ee73f79deb', 1400) },
  { title: 'The Long Counter', category: 'Interior', image: img('1514933651103-005eec06c04b', 1400) },
  { title: 'Coffee, Poured Slow', category: 'Detail', image: img('1470337458703-46ad1756a187', 1400) },
  { title: 'Low Light, Long Nights', category: 'Interior', image: img('1543007630-9710e4a00a20', 1400) },
  { title: 'The Dining Room', category: 'Interior', image: img('1466978913421-dad2ebd01d17', 1400) },
  { title: 'Copper & Candlelight', category: 'Detail', image: img('1517248135467-4c7edcad34c4', 1400) },
  { title: 'Mezze Hour', category: 'Kitchen', image: img('1546069901-ba9599a7e63c', 1400) },
  { title: 'Charcoal Grill', category: 'Kitchen', image: img('1529042410759-befb1204b468', 1400) },
  { title: 'Lamplight', category: 'Detail', image: img('1574238919966-5cb3d9693a4b', 1400) },
];

async function main() {
  const client = new pg.Client({ connectionString });
  await client.connect();

  const schema = readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
  await client.query(schema);

  for (const [key, value] of Object.entries(CONTENT)) {
    await client.query(
      'INSERT INTO site_content (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
      [key, value],
    );
  }

  const { rows: existingMenu } = await client.query('SELECT count(*)::int AS c FROM menu_items');
  if (existingMenu[0].c === 0) {
    let order = 0;
    for (const item of MENU) {
      await client.query(
        `INSERT INTO menu_items (name, description, price, category, image, badge, is_featured, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          item.name,
          item.description,
          item.price,
          item.category,
          item.image,
          item.badge,
          item.featured,
          order++,
        ],
      );
    }
  }

  const { rows: existingGallery } = await client.query('SELECT count(*)::int AS c FROM gallery_images');
  if (existingGallery[0].c === 0) {
    let order = 0;
    for (const image of GALLERY) {
      await client.query(
        'INSERT INTO gallery_images (title, category, image, sort_order) VALUES ($1, $2, $3, $4)',
        [image.title, image.category, image.image, order++],
      );
    }
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@mekan76.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Mekan76!2026';
  const adminHash = await bcrypt.hash(adminPassword, 10);
  await client.query(
    `INSERT INTO users (name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, 'ADMIN')
     ON CONFLICT (email) DO NOTHING`,
    ['Mekan 76 Owner', adminEmail, '+90 212 000 76 76', adminHash],
  );

  const demoHash = await bcrypt.hash('Demo1234!', 10);
  await client.query(
    `INSERT INTO users (name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, 'CUSTOMER')
     ON CONFLICT (email) DO NOTHING`,
    ['Elif Demir', 'elif@example.com', '+90 532 111 22 33', demoHash],
  );

  const { rows: existingRes } = await client.query('SELECT count(*)::int AS c FROM reservations');
  if (existingRes[0].c === 0) {
    const today = new Date();
    const iso = (offset) => {
      const d = new Date(today);
      d.setUTCDate(d.getUTCDate() + offset);
      return d.toISOString().slice(0, 10);
    };
    const demo = [
      ['Elif Demir', 'elif@example.com', '+90 532 111 22 33', iso(1), '20:00', 2, 'Window table, anniversary', 'CONFIRMED'],
      ['Kerem Yilmaz', 'kerem@example.com', '+90 533 444 55 66', iso(2), '21:00', 4, 'Shisha on the terrace', 'PENDING'],
      ['Nadia Rossi', 'nadia@example.com', '+90 534 777 88 99', iso(3), '19:30', 6, 'Birthday — please prepare a candle', 'PENDING'],
      ['Ahmet Kaya', 'ahmet@example.com', '+90 535 222 33 44', iso(-2), '22:00', 3, null, 'SEATED'],
    ];
    for (const r of demo) {
      await client.query(
        `INSERT INTO reservations (name, email, phone, date, time, guests, requests, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        r,
      );
    }
  }

  await client.end();
  console.log('[db-setup] schema ready and demo content seeded');
}

main().catch((error) => {
  console.error('[db-setup] failed:', error);
  process.exit(1);
});
