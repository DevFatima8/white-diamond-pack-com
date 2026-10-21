import type { Prisma } from '@prisma/client';
import db from '@/lib/db';
import { PUBLIC_PRODUCT_SELECT } from '@/lib/catalog';
import { toCardData, type ProductCardData } from '@/lib/catalog-types';
import { SHOP_PAGE_SIZE, type ShopParams } from '@/lib/shop-params';

/** The price a customer pays: the sale price if there is one, otherwise the price. */
const effectivePrice = (p: { price: number | null; salePrice: number | null }) => p.salePrice ?? p.price;

export interface ShopResult {
  products: ProductCardData[];
  total: number;
  page: number;
  pageCount: number;
  priceBounds: { min: number; max: number };
}

/**
 * Products for one shop page. Filtering by text/category/stock happens in the database;
 * price filtering and sorting use the EFFECTIVE price (sale price when set), which SQL
 * can't express through Prisma, so those run in JavaScript on the filtered list.
 * That's fast for a catalogue of hundreds of products.
 */
export async function getShopPage(params: ShopParams): Promise<ShopResult> {
  const where: Prisma.ProductWhereInput = { isActive: true };
  const and: Prisma.ProductWhereInput[] = [];
  if (params.category) and.push({ categoryRef: { slug: params.category, isActive: true } });
  if (params.inStock) and.push({ inStock: true });
  if (params.q) {
    and.push({
      OR: [
        { name: { contains: params.q } },
        { nameAr: { contains: params.q } },
        { sku: { contains: params.q } },
        { packing: { contains: params.q } },
        { description: { contains: params.q } },
      ],
    });
  }
  if (and.length) where.AND = and;

  const [rows, bounds] = await Promise.all([
    db.product.findMany({ where, select: PUBLIC_PRODUCT_SELECT, orderBy: { createdAt: 'desc' } }),
    db.product.findMany({ where: { isActive: true }, select: { price: true, salePrice: true } }),
  ]);

  let list = rows.filter((p) => {
    const price = effectivePrice(p);
    if (params.min !== null && (price === null || price < params.min)) return false;
    if (params.max !== null && (price === null || price > params.max)) return false;
    return true;
  });

  const priceOf = (p: (typeof list)[number]) => effectivePrice(p) ?? Number.POSITIVE_INFINITY; // "price on request" last
  if (params.sort === 'price-asc') list = [...list].sort((a, b) => priceOf(a) - priceOf(b));
  if (params.sort === 'price-desc') list = [...list].sort((a, b) => (effectivePrice(b) ?? -1) - (effectivePrice(a) ?? -1));
  if (params.sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));

  const total = list.length;
  const pageCount = Math.max(1, Math.ceil(total / SHOP_PAGE_SIZE));
  const page = Math.min(params.page, pageCount);
  const prices = bounds.map(effectivePrice).filter((n): n is number => n !== null);

  return {
    products: list.slice((page - 1) * SHOP_PAGE_SIZE, page * SHOP_PAGE_SIZE).map(toCardData),
    total,
    page,
    pageCount,
    priceBounds: { min: prices.length ? Math.floor(Math.min(...prices)) : 0, max: prices.length ? Math.ceil(Math.max(...prices)) : 0 },
  };
}
