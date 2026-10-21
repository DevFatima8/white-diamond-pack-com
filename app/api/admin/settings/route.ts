import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { serverError, validationError } from '@/lib/api';
import { settingsSchema } from '@/lib/validation/admin';

// Admin only: save all settings at once (each key is upserted: updated, or created if missing).
export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const parsed = settingsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    await db.$transaction(
      Object.entries(parsed.data).map(([key, value]) =>
        db.setting.upsert({ where: { key }, create: { key, value }, update: { value } }),
      ),
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return serverError('admin settings PUT', err, 'Failed to save settings');
  }
}
