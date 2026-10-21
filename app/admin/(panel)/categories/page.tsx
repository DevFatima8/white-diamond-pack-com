import type { Metadata } from 'next';
import db from '@/lib/db';
import CategoriesManager from '@/components/admin/CategoriesManager';

export const metadata: Metadata = { title: 'Categories' };

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { nameEn: 'asc' }],
    include: { _count: { select: { products: true } } },
  });

  // Only send the browser what the list needs.
  const rows = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    nameEn: c.nameEn,
    nameAr: c.nameAr,
    descriptionEn: c.descriptionEn,
    descriptionAr: c.descriptionAr,
    image: c.image,
    isActive: c.isActive,
    productCount: c._count.products,
  }));

  // key: re-create the client list when the set of categories changes after a refresh
  return <CategoriesManager key={rows.map((r) => `${r.id}:${r.productCount}`).join(',')} initial={rows} />;
}
