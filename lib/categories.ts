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

/** Active categories from the database, in admin-defined order, with product counts. */
export async function getCategories(): Promise<CategoryItem[]> {
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
}
