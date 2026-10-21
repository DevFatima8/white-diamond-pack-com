import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_SECONDS,
  MissingEnvError,
  createAdminToken,
} from '@/lib/auth';
import { RateLimiter, getClientIp } from '@/lib/rate-limit';

// 5 failed attempts per IP, then blocked for the rest of the 15-minute window.
// Kept at module level so the counter survives between requests.
const loginLimiter = new RateLimiter(5, 15 * 60 * 1000);

const loginSchema = z.object({
  email: z.string().trim().min(1).max(254), // email OR username
  password: z.string().min(1).max(200),
});

/** Compare two strings in constant time, so the response time doesn't leak how many characters matched. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Checks the password against ADMIN_PASSWORD_HASH (bcrypt, recommended)
 * or, if no hash is set, against the plain ADMIN_PASSWORD.
 */
async function checkPassword(password: string): Promise<boolean> {
  // In .env the hash is written with "\$" (see scripts/hash-password.ts); hosting
  // panels may store it raw. Un-escaping makes both forms work.
  const hash = process.env.ADMIN_PASSWORD_HASH?.replace(/\\\$/g, '$');
  if (hash) return bcrypt.compare(password, hash);

  const plain = process.env.ADMIN_PASSWORD;
  if (plain) return safeEqual(password, plain);

  throw new MissingEnvError('ADMIN_PASSWORD_HASH (or ADMIN_PASSWORD)');
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const retryAfter = loginLimiter.retryAfterSeconds(ip);
  if (retryAfter > 0) {
    const minutes = Math.ceil(retryAfter / 60);
    return NextResponse.json(
      { success: false, message: `Too many login attempts. Try again in ${minutes} minute(s).` },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Please enter your email/username and password.' },
      { status: 400 },
    );
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUsername = process.env.ADMIN_USERNAME;
    if (!adminEmail && !adminUsername) throw new MissingEnvError('ADMIN_EMAIL (or ADMIN_USERNAME)');

    const { email, password } = parsed.data;
    const identifier = email.toLowerCase();
    const userMatches =
      (!!adminEmail && safeEqual(identifier, adminEmail.toLowerCase())) ||
      (!!adminUsername && safeEqual(identifier, adminUsername.toLowerCase()));

    // Always run the password check, even if the user is wrong,
    // so both cases take about the same time.
    const passwordMatches = await checkPassword(password);

    if (!userMatches || !passwordMatches) {
      loginLimiter.hit(ip);
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials' },
        { status: 401 },
      );
    }

    loginLimiter.reset(ip);

    const token = await createAdminToken({
      email: adminEmail ?? '',
      username: adminUsername ?? '',
      role: 'admin',
    });

    const response = NextResponse.json({ success: true, message: 'Signed in' });
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true, // JavaScript in the browser can't read it
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_SESSION_SECONDS,
    });
    return response;
  } catch (err) {
    // Log the real reason on the server, show a safe message to the browser.
    console.error('[auth/login]', err instanceof Error ? err.message : err);
    const message =
      err instanceof MissingEnvError
        ? 'Admin login is not configured on the server. Check the server logs.'
        : 'Authentication error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
