import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { serverError, uniqueConflict, validationError } from '@/lib/api';
import { categoryFormSchema } from '@/lib/validation/admin';

// Admin only: create a category (added at the end of the list).
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const parsed = categoryFormSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    const last = await db.category.aggregate({ _max: { sortOrder: true } });
    const category = await db.category.create({
      data: { ...parsed.data, sortOrder: (last._max.sortOrder ?? 0) + 1 },
    });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err) {
    return uniqueConflict(err, { slug: 'slug' }) ?? serverError('admin categories POST', err, 'Failed to create category');
  }
}
