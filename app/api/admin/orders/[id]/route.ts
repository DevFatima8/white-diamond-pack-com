import { NextRequest, NextResponse } from 'next/server';
import type { OrderStatus } from '@prisma/client';
import db from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { isNotFoundError, serverError, validationError } from '@/lib/api';
import { orderStatusSchema } from '@/lib/validation/admin';

type RouteContext = { params: Promise<{ id: string }> };

// Admin only: change an order's status (the dropdown on the order page saves instantly).
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const parsed = orderStatusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    const order = await db.order.update({
      where: { id },
      data: { status: parsed.data.status as OrderStatus },
      select: { id: true, orderNumber: true, status: true },
    });
    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    if (isNotFoundError(err)) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    return serverError('admin order PATCH', err, 'Failed to update order');
  }
}
