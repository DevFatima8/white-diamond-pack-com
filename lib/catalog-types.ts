import type { Prisma } from '@prisma/client';
import type { PUBLIC_PRODUCT_SELECT } from './catalog';

/**
 * Browser-safe catalogue types and helpers (no database import here, so Client
 * Components can use them). The queries live in lib/catalog.ts (server only).
 */
export type PublicProduct = Prisma.ProductGetPayload<{ select: typeof PUBLIC_PRODUCT_SELECT }>;

/** The smaller shape used by product cards (home, shop grid). Plain JSON, safe to pass to Client Components. */
export interface ProductCardData {
  id: string;
  slug: string | null;
  name: string;
  nameAr: string | null;
  image: string;
  price: number | null;
  salePrice: number | null;
  unit: string;
  packing: string;
  packingAr: string | null;
  minOrderQty: number;
  inStock: boolean;
  category: { slug: string; nameEn: string; nameAr: string } | null;
}

export function toCardData(p: PublicProduct): ProductCardData {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    nameAr: p.nameAr,
    image: p.image,
    price: p.price,
    salePrice: p.salePrice,
    unit: p.unit,
    packing: p.packing,
    packingAr: p.packingAr,
    minOrderQty: p.minOrderQty,
    inStock: p.inStock,
    category: p.categoryRef,
  };
}

