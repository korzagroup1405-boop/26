import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://mekan76.com';
  const routes = ['', '/menu', '/reservations', '/about', '/amenities', '/gallery', '/contact'];
  const now = new Date();

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/reservations' ? 0.9 : 0.7,
  }));
}
