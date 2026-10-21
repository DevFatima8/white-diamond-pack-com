import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { isNotFoundError, serverError, validationError } from '@/lib/api';
import { messageReadSchema } from '@/lib/validation/admin';

type RouteContext = { params: Promise<{ id: string }> };

// Admin only: mark a contact/quote message as read or unread.
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const parsed = messageReadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    const message = await db.message.update({ where: { id }, data: parsed.data, select: { id: true, isRead: true } });
    return NextResponse.json({ success: true, data: message });
  } catch (err) {
    if (isNotFoundError(err)) return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    return serverError('admin message PATCH', err, 'Failed to update message');
  }
}
