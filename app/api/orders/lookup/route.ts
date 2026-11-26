import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { serverError, validationError } from '@/lib/api';
import { verifyOrderToken } from '@/lib/order-token';
import { RateLimiter, getClientIp } from '@/lib/rate-limit';
import { orderHistoryLookupSchema } from '@/lib/validation/order';

const lookupLimiter = new RateLimiter(40, 15 * 60 * 1000);

const ORDER_NUMBER = /^WD-\d{1,9}$/i;

/**
 * Public: refresh order summaries for entries the browser saved locally.
 * Only orders with a valid signed token are returned (same secret as confirmation links).
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (lookupLimiter.retryAfterSeconds(ip) > 0) {
    return NextResponse.json({ success: false, error: 'too_many' }, { status: 429 });
  }

  const parsed = orderHistoryLookupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  const allowed = new Map<string, string>();
  for (const { orderNumber, token } of parsed.data.entries) {
    const number = orderNumber.toUpperCase();
    if (!ORDER_NUMBER.test(number)) continue;
    if (verifyOrderToken(number, token)) allowed.set(number, token);
  }

  if (allowed.size === 0) {
    lookupLimiter.hit(ip);
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const orders = await db.order.findMany({
      where: { orderNumber: { in: [...allowed.keys()] } },
      select: {
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    lookupLimiter.hit(ip);

    return NextResponse.json({
      success: true,
      data: orders.map((o) => ({
        orderNumber: o.orderNumber,
        status: o.status,
        total: o.total,
        createdAt: o.createdAt.toISOString(),
        itemCount: o._count.items,
        token: allowed.get(o.orderNumber)!,
      })),
    });
  } catch (err) {
    return serverError('orders lookup POST', err, 'Could not load orders');
  }
}