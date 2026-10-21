import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { serverError, validationError } from '@/lib/api';
import { categoryReorderSchema } from '@/lib/validation/admin';

// Admin only: save a new order. Body: { ids: [...all category ids, top to bottom] }
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const parsed = categoryReorderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);
  const { ids } = parsed.data;

  try {
    // The list must contain every category exactly once, otherwise the order would get mixed up.
    const existing = await db.category.findMany({ select: { id: true } });
    const sameSet = existing.length === ids.length && new Set(ids).size === ids.length && existing.every((c) => ids.includes(c.id));
    if (!sameSet) {
      return NextResponse.json({ success: false, error: 'The category list changed — reload the page and try again' }, { status: 409 });
    }

    await db.$transaction(ids.map((id, index) => db.category.update({ where: { id }, data: { sortOrder: index + 1 } })));
    return NextResponse.json({ success: true });
  } catch (err) {
    return serverError('admin categories reorder', err, 'Failed to save the new order');
  }
}
