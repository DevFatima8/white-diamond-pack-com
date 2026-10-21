import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { initialProducts } from '@/data/products';
import { requireAdmin } from '@/lib/auth';
import { isNotFoundError, serverError, validationError } from '@/lib/api';
import { productUpdateSchema } from '@/lib/validation/product';

type RouteContext = { params: Promise<{ id: string }> };

const notFound = () =>
  NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

// Public: read one product.
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  try {
    const product = await db.product.findUnique({ where: { id } });
    return product ? NextResponse.json({ success: true, data: product }) : notFound();
  } catch (dbErr) {
    // TODO(Phase 2): remove this fallback once the database is seeded.
    console.warn('[product GET] database unavailable, using static catalogue:', dbErr);
    const product = initialProducts.find((p) => p.id.toString() === id);
    return product ? NextResponse.json({ success: true, data: product }) : notFound();
  }
}

// Admin only: update a product. Only whitelisted fields are accepted.
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const parsed = productUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    const updated = await db.product.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    if (isNotFoundError(err)) return notFound();
    return serverError('product PUT', err, 'Failed to update product');
  }
}

// Admin only: delete a product.
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;

  try {
    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    if (isNotFoundError(err)) return notFound();
    return serverError('product DELETE', err, 'Failed to delete product');
  }
}
