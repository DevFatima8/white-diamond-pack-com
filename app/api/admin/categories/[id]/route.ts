import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { isNotFoundError, serverError, uniqueConflict, validationError } from '@/lib/api';
import { categoryFormSchema, categoryToggleSchema } from '@/lib/validation/admin';

type RouteContext = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });

// Admin only: save the edit form.
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const parsed = categoryFormSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    // Update the category and keep the products' old text column in sync with the new name,
    // in one transaction (both or neither).
    const category = await db.$transaction(async (tx) => {
      const updated = await tx.category.update({ where: { id }, data: parsed.data });
      await tx.product.updateMany({ where: { categoryId: id }, data: { category: updated.nameEn } });
      return updated;
    });
    return NextResponse.json({ success: true, data: category });
  } catch (err) {
    if (isNotFoundError(err)) return notFound();
    return uniqueConflict(err, { slug: 'slug' }) ?? serverError('admin category PUT', err, 'Failed to save category');
  }
}

// Admin only: activate / deactivate. Inactive categories disappear from the shop menu.
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const parsed = categoryToggleSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    const category = await db.category.update({ where: { id }, data: parsed.data, select: { id: true, isActive: true } });
    return NextResponse.json({ success: true, data: category });
  } catch (err) {
    if (isNotFoundError(err)) return notFound();
    return serverError('admin category PATCH', err, 'Failed to update category');
  }
}
