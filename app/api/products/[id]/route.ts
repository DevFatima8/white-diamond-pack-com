import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { isNotFoundError, serverError, validationError } from '@/lib/api';
import { productUpdateSchema } from '@/lib/validation/product';

type RouteContext = { params: Promise<{ id: string }> };

const notFound = () =>
  NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

// Public: read one active product, from the database only.
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  try {
    const product = await db.product.findFirst({
      where: { id, isActive: true },
      include: { categoryRef: { select: { slug: true, nameEn: true, nameAr: true } } },
    });
    return product ? NextResponse.json({ success: true, data: product }) : notFound();
  } catch (err) {
    return serverError('product GET', err, 'Catalogue is temporarily unavailable', 503);
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
