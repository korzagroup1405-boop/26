export const CATEGORIES = [
  'Signature Drinks',
  'Coffee',
  'Fresh Juices',
  'Desserts',
  'Main Courses',
  'Appetizers',
] as const;

export type Category = (typeof CATEGORIES)[number];

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: Category | string;
  image: string;
  badge: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
};

export type GalleryImage = {
  id: number;
  title: string;
  category: string;
  image: string;
  sort_order: number;
  is_visible: boolean;
};

export type Reservation = {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  requests: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'SEATED' | 'CANCELLED' | string;
  user_id: number | null;
  created_at: string;
};

export type Order = {
  id: number;
  customer_name: string;
  phone: string;
  email: string | null;
  items: { id: number; name: string; price: number; qty: number }[];
  total: string;
  note: string | null;
  status: string;
  created_at: string;
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
  reservation_count?: number;
};

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export const RESERVATION_STATUSES = ['PENDING', 'CONFIRMED', 'SEATED', 'CANCELLED'] as const;
export const ORDER_STATUSES = ['NEW', 'PREPARING', 'SERVED', 'CANCELLED'] as const;

export const CAPACITY_PER_SLOT = 50;

export const TIME_SLOTS = [
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];
