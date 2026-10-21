import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import db from '@/lib/db';
import { serverError } from '@/lib/api';

// Public, read-only. (Creating/editing products: /api/admin/products.)
// Lists active products, from the database only.
// Optional ?category= accepts a category slug ("aluminium-foil-rolls")
// or an old category name ("Aluminium Foil Rolls").
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category')?.trim();

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (category) where.OR = [{ categoryRef: { slug: category } }, { category }];

  try {
    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { categoryRef: { select: { slug: true, nameEn: true, nameAr: true } } },
    });
    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (err) {
    return serverError('products GET', err, 'Catalogue is temporarily unavailable', 503);
  }
}
