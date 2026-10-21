import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { isNotFoundError, serverError, uniqueConflict, validationError } from '@/lib/api';
import { productFormSchema, productToggleSchema } from '@/lib/validation/product';
import { PRODUCT_UNIQUE_FIELDS, productDataFromForm } from '@/lib/admin/products';

type RouteContext = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

// Admin only: save the full edit form.
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const parsed = productFormSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    const category = await db.category.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: { formErrors: [], fieldErrors: { categoryId: ['Category not found'] } } },
        { status: 400 },
      );
    }
    await db.product.update({ where: { id }, data: productDataFromForm(parsed.data, category.nameEn) });
    return NextResponse.json({ success: true, data: { id } });
  } catch (err) {
    if (isNotFoundError(err)) return notFound();
    return uniqueConflict(err, PRODUCT_UNIQUE_FIELDS) ?? serverError('admin product PUT', err, 'Failed to save product');
  }
}

// Admin only: flip Featured / Active from the products table.
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const parsed = productToggleSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    const product = await db.product.update({
      where: { id },
      data: parsed.data,
      select: { id: true, isFeatured: true, isActive: true },
    });
    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    if (isNotFoundError(err)) return notFound();
    return serverError('admin product PATCH', err, 'Failed to update product');
  }
}

// Admin only: delete. Past orders keep their own copy of the name and price
// (OrderItem snapshot), and their product link simply becomes empty.
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  try {
    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (isNotFoundError(err)) return notFound();
    return serverError('admin product DELETE', err, 'Failed to delete product');
  }
}
