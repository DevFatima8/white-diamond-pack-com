import { NextRequest, NextResponse, after } from 'next/server';
import db from '@/lib/db';
import { serverError, validationError } from '@/lib/api';
import { RateLimiter, getClientIp } from '@/lib/rate-limit';
import { quoteRequestSchema } from '@/lib/validation/order';
import { notifyNewMessage } from '@/lib/notify';

// 5 quote requests per IP per 15 minutes (spam protection).
const quoteLimiter = new RateLimiter(5, 15 * 60 * 1000);

/** Public: "Request bulk quote" from a product page → saved as a QUOTE message in Admin → Messages. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (quoteLimiter.retryAfterSeconds(ip) > 0) {
    return NextResponse.json({ success: false, error: 'too_many' }, { status: 429 });
  }

  const parsed = quoteRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);
  const { productId, ...data } = parsed.data;

  try {
    // Take the product name from the database, not from the browser.
    const product = productId
      ? await db.product.findFirst({ where: { id: productId, isActive: true }, select: { id: true, name: true } })
      : null;

    const saved = await db.message.create({
      data: { ...data, type: 'QUOTE', productId: product?.id ?? null, productName: product?.name ?? null },
    });
    quoteLimiter.hit(ip);
    // Email the owner after responding, so the customer doesn't wait
    after(() => notifyNewMessage(saved, `${request.nextUrl.origin}/admin/messages`));
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return serverError('quote POST', err, 'Could not send the request');
  }
}
