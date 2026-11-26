export type ResourceConfig = {
  table: string;
  fields: string[];
  order: string;
  listSelect?: string;
  canDelete?: boolean;
  canCreate?: boolean;
};

export const RESOURCES: Record<string, ResourceConfig> = {
  menu: {
    table: 'menu_items',
    fields: [
      'name',
      'description',
      'price',
      'category',
      'image',
      'badge',
      'is_available',
      'is_featured',
      'sort_order',
    ],
    order: 'sort_order ASC, id ASC',
    canDelete: true,
    canCreate: true,
  },
  gallery: {
    table: 'gallery_images',
    fields: ['title', 'category', 'image', 'sort_order', 'is_visible'],
    order: 'sort_order ASC, id ASC',
    canDelete: true,
    canCreate: true,
  },
  reservations: {
    table: 'reservations',
    fields: ['name', 'email', 'phone', 'date', 'time', 'guests', 'requests', 'status'],
    order: "date DESC, time DESC",
    listSelect:
      "id, name, email, phone, to_char(date, 'YYYY-MM-DD') AS date, time, guests, requests, status, created_at",
    canDelete: true,
    canCreate: false,
  },
  customers: {
    table: 'users',
    fields: ['role'],
    order: 'created_at DESC',
    listSelect:
      'id, name, email, phone, role, created_at, (SELECT count(*)::int FROM reservations r WHERE r.user_id = users.id) AS reservation_count',
    canDelete: false,
    canCreate: false,
  },
  orders: {
    table: 'orders',
    fields: ['status'],
    order: 'created_at DESC',
    canDelete: true,
    canCreate: false,
  },
};

export function pickFields(resource: ResourceConfig, body: Record<string, unknown>) {
  const entries = Object.entries(body).filter(
    ([key, value]) => resource.fields.includes(key) && value !== undefined,
  );
  return entries;
}
