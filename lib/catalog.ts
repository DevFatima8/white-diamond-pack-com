import type { Prisma } from '@prisma/client';
import db from '@/lib/db';
import { toCardData, type ProductCardData } from '@/lib/catalog-types';

export type { ProductCardData };

/** Product fields the public website needs — nothing internal. */
export const PUBLIC_PRODUCT_SELECT = {
  id: true,
  slug: true,
  sku: true,
  name: true,
  nameAr: true,
  description: true,
  descriptionAr: true,
  category: true,
  categoryRef: { select: { slug: true, nameEn: true, nameAr: true } },
  image: true,
  images: true,
  price: true,
  salePrice: true,
  unit: true,
  packing: true,
  packingAr: true,
  capacity: true,
  material: true,
  color: true,
  features: true,
  featuresAr: true,
  minOrderQty: true,
  stockQty: true,
  inStock: true,
  isFeatured: true,
} satisfies Prisma.ProductSelect;

/** Featured products for the homepage "Best Selling" section. */
export async function getFeaturedProducts(limit = 8): Promise<ProductCardData[]> {
  const products = await db.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    select: PUBLIC_PRODUCT_SELECT,
  });
  return products.map(toCardData);
}

/** Products from the given categories (industry pages). Featured first, then newest. */
export async function getProductsInCategories(categorySlugs: string[], limit = 8): Promise<ProductCardData[]> {
  if (!categorySlugs.length) return [];
  const products = await db.product.findMany({
    where: { isActive: true, categoryRef: { slug: { in: categorySlugs }, isActive: true } },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    select: PUBLIC_PRODUCT_SELECT,
  });
  return products.map(toCardData);
}
