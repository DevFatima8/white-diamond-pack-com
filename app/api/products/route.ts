import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { initialProducts } from '@/data/products';
import { requireAdmin } from '@/lib/auth';
import { serverError, validationError } from '@/lib/api';
import { productCreateSchema } from '@/lib/validation/product';

// Public: anyone can list products.
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');

  try {
    const products = await db.product.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (dbErr) {
    // TODO(Phase 2): remove this fallback once the database is seeded.
    console.warn('[products GET] database unavailable, using static catalogue:', dbErr);
    const products = category
      ? initialProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
      : initialProducts;
    return NextResponse.json({ success: true, count: products.length, data: products });
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
