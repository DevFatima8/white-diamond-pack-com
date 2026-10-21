import { MetadataRoute } from 'next';
import db from '@/lib/db';
import { INDUSTRIES } from '@/lib/industries';
import { routes, categoryHref, productHref, industryHref } from '@/lib/routes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001').replace(/\/+$/, '');
  const now = new Date();

  // Static site pages
  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: routes.home, priority: 1.0, changeFrequency: 'daily' },
    { path: routes.shop, priority: 0.9, changeFrequency: 'daily' },
    { path: routes.about, priority: 0.8, changeFrequency: 'monthly' },
    { path: routes.customPackaging, priority: 0.8, changeFrequency: 'monthly' },
    { path: routes.presence, priority: 0.7, changeFrequency: 'monthly' },
    { path: routes.divisions, priority: 0.7, changeFrequency: 'monthly' },
    { path: routes.industries, priority: 0.7, changeFrequency: 'weekly' },
    { path: routes.contact, priority: 0.7, changeFrequency: 'monthly' },
    { path: routes.careers, priority: 0.6, changeFrequency: 'weekly' },
    { path: routes.faq, priority: 0.6, changeFrequency: 'monthly' },
    { path: routes.shipping, priority: 0.5, changeFrequency: 'monthly' },
    { path: routes.terms, priority: 0.4, changeFrequency: 'yearly' },
    { path: routes.privacy, priority: 0.4, changeFrequency: 'yearly' },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Industry dynamic routes
  const industryEntries: MetadataRoute.Sitemap = INDUSTRIES.map((i) => ({
    url: `${baseUrl}${industryHref(i.slug)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Categories and products from database (failsafe fallback to empty array if DB unavailable during build)
  let categoryEntries: MetadataRoute.Sitemap = [];
  let productEntries: MetadataRoute.Sitemap = [];

  try {
    const [categories, products] = await Promise.all([
      db.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      db.product.findMany({
        where: { isActive: true, slug: { not: null } },
        select: { id: true, slug: true, name: true, updatedAt: true },
      }),
    ]);

    categoryEntries = categories.map((c) => ({
      url: `${baseUrl}${categoryHref(c.slug)}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    productEntries = products.map((p) => ({
      url: `${baseUrl}${productHref(p)}`,
      lastModified: p.updatedAt,
      changeFrequency: 'daily',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('[sitemap] could not fetch categories or products:', err);
  }

  return [...staticEntries, ...industryEntries, ...categoryEntries, ...productEntries];
}
