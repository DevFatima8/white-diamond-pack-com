import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import db from '@/lib/db';
import { serverError } from '@/lib/api';
import { PUBLIC_PRODUCT_SELECT } from '@/lib/catalog';

/**
 * Public, read-only. (Creating/editing products: /api/admin/products.)
 * Lists ACTIVE products, public fields only. Optional filters:
 *   ?category=<slug or old name>   ?ids=a,b,c (cart)   ?q=foil (search)   ?featured=1   ?limit=6
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const category = sp.get('category')?.trim();
  const q = sp.get('q')?.trim().slice(0, 80);
  const ids = sp
    .get('ids')
    ?.split(',')
    .map((s) => s.trim())
    .filter((s) => s && s.length <= 40)
    .slice(0, 100);
  const limit = Math.min(Math.max(Number(sp.get('limit')) || 0, 0), 200) || undefined;

  const and: Prisma.ProductWhereInput[] = [];
  if (category) and.push({ OR: [{ categoryRef: { slug: category } }, { category }] });
  if (ids) and.push({ id: { in: ids } });
  if (sp.get('featured') === '1') and.push({ isFeatured: true });
  if (q) and.push({ OR: [{ name: { contains: q } }, { nameAr: { contains: q } }, { sku: { contains: q } }, { packing: { contains: q } }] });
  const where: Prisma.ProductWhereInput = { isActive: true, ...(and.length && { AND: and }) };

  try {
    const products = await db.product.findMany({
      where,
      orderBy: q ? { name: 'asc' } : { createdAt: 'desc' },
      take: limit,
      select: PUBLIC_PRODUCT_SELECT,
    });
    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (err) {
    return serverError('products GET', err, 'Catalogue is temporarily unavailable', 503);
  }
}
