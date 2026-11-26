import { query } from './db';
import type { GalleryImage, MenuItem } from './types';

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    return await query<MenuItem>(
      `SELECT id, name, description, price, category, image, badge,
              is_available, is_featured, sort_order
       FROM menu_items
       ORDER BY is_featured DESC, sort_order ASC, id ASC`,
    );
  } catch {
    return [];
  }
}

export async function getGallery(visibleOnly = true): Promise<GalleryImage[]> {
  try {
    return await query<GalleryImage>(
      `SELECT id, title, category, image, sort_order, is_visible
       FROM gallery_images
       ${visibleOnly ? 'WHERE is_visible = true' : ''}
       ORDER BY sort_order ASC, id ASC`,
    );
  } catch {
    return [];
  }
}

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=2000&q=80';

export const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80';

export const LOUNGE_IMAGE =
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80';
