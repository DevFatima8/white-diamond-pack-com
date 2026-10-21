import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Order numbers are easy to guess (WD-1031, WD-1032, …). The confirmation page shows
 * the customer's name, phone and address, so it must NOT open with the number alone.
 *
 * Instead, the link carries a token: an HMAC "signature" of the order number made with
 * a server-only secret. Nobody can create a valid token for another order without the
 * secret, and we don't need to store anything extra in the database.
 */
function secret(): string {
  const s = process.env.ORDER_LINK_SECRET || process.env.ADMIN_JWT_SECRET;
  if (!s) throw new Error('Missing ORDER_LINK_SECRET (or ADMIN_JWT_SECRET) environment variable.');
  return s;
}

export function orderToken(orderNumber: string): string {
  return createHmac('sha256', secret()).update(`order:${orderNumber}`).digest('base64url').slice(0, 32);
}

export function verifyOrderToken(orderNumber: string, token: string | undefined | null): boolean {
  if (!token) return false;
  const expected = Buffer.from(orderToken(orderNumber));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
