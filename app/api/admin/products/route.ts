import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { serverError, uniqueConflict, validationError } from '@/lib/api';
import { productFormSchema } from '@/lib/validation/product';
import { PRODUCT_UNIQUE_FIELDS, productDataFromForm } from '@/lib/admin/products';

// Admin only: create a product.
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

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

    const product = await db.product.create({ data: productDataFromForm(parsed.data, category.nameEn) });
    return NextResponse.json({ success: true, data: { id: product.id } }, { status: 201 });
  } catch (err) {
    return uniqueConflict(err, PRODUCT_UNIQUE_FIELDS) ?? serverError('admin products POST', err, 'Failed to create product');
  }
}
