import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { serverError, validationError } from '@/lib/api';
import { productCreateSchema } from '@/lib/validation/product';

// Public: list active products, from the database only.
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

// Admin only: create a product.
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const parsed = productCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    const product = await db.product.create({ data: parsed.data });
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err) {
    return serverError('products POST', err, 'Failed to create product');
  }
}
