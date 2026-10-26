import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { serverError, validationError } from '@/lib/api';
import { GALLERY_SETTING_KEY, gallerySchema } from '@/lib/gallery-types';

// Admin only: save the whole gallery list (order = display order).
export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const parsed = gallerySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    const value = JSON.stringify(parsed.data);
    await db.setting.upsert({ where: { key: GALLERY_SETTING_KEY }, create: { key: GALLERY_SETTING_KEY, value }, update: { value } });
    return NextResponse.json({ success: true, count: parsed.data.length });
  } catch (err) {
    return serverError('admin gallery PUT', err, 'Failed to save the gallery');
  }
}
