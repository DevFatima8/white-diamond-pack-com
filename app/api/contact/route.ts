import { NextRequest, NextResponse } from 'next/server';
import type { MessageType } from '@prisma/client';
import db from '@/lib/db';
import { serverError, validationError } from '@/lib/api';
import { RateLimiter, getClientIp } from '@/lib/rate-limit';
import { contactRequestSchema } from '@/lib/validation/order';

// 5 messages per IP per 15 minutes — enough for real people, blocks spam scripts.
const contactLimiter = new RateLimiter(5, 15 * 60 * 1000);

// Which inbox tab each form lands in (Admin → Messages)
const TYPE_BY_KIND: Record<string, MessageType> = {
  contact: 'CONTACT',
  'custom-packaging': 'QUOTE',
  career: 'CAREER',
};

/** Public: contact form, custom-packaging quote form, job applications → Admin → Messages. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (contactLimiter.retryAfterSeconds(ip) > 0) {
    return NextResponse.json({ success: false, error: 'too_many' }, { status: 429 });
  }

  const parsed = contactRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);
  const { kind, ...data } = parsed.data;

  try {
    await db.message.create({ data: { ...data, type: TYPE_BY_KIND[kind] } });
    contactLimiter.hit(ip);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return serverError('contact POST', err, 'Could not send the message');
  }
}
