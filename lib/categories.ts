import { cache } from 'react';
import db from '@/lib/db';

/** A category as sent to the browser (header mega-menu, shop filters). */
export interface CategoryItem {
  id: string;
  slug: string;
  name: string; // English
  nameAr: string;
  description: string | null;
  descriptionAr: string | null;
  image: string | null;
  count: number; // active products in this category
}

/**
 * Active categories from the database, in admin-defined order, with product counts.
 * Wrapped in React's cache(): the site layout and the page can both call it, and the
 * database is queried only once per request.
 */
export const getCategories = cache(async (): Promise<CategoryItem[]> => {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { nameEn: 'asc' }],
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });

  return categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.nameEn,
    nameAr: c.nameAr,
    description: c.descriptionEn,
    descriptionAr: c.descriptionAr,
    image: c.image,
    count: c._count.products,
  }));
});
