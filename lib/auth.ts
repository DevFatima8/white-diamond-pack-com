import { jwtVerify, SignJWT } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

export const ADMIN_COOKIE_NAME = 'wd_admin_token';

/** How long an admin stays logged in (seconds). Used for both the JWT and the cookie. */
export const ADMIN_SESSION_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface AdminPayload {
  email: string;
  username: string;
  role: 'admin';
}

/**
 * Thrown when a required environment variable is missing.
 * We fail loudly instead of falling back to a default secret/password,
 * because a default that ships in the code is a password everyone can read.
 */
export class MissingEnvError extends Error {
  constructor(name: string) {
    super(`Missing required environment variable: ${name}. Add it to your .env file (see .env.example).`);
    this.name = 'MissingEnvError';
  }
}

// The secret is read lazily (on first use), not when the file is imported.
// That way `next build` works without secrets, and a missing secret only
// breaks the admin features — with a clear error — instead of the whole site.
function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new MissingEnvError('ADMIN_JWT_SECRET');
  if (secret.length < 32) {
    throw new Error('ADMIN_JWT_SECRET must be at least 32 characters long.');
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ['HS256'] });
    if (payload.role !== 'admin') return null;
    return payload as unknown as AdminPayload;
  } catch (err) {
    if (err instanceof MissingEnvError) console.error(err.message);
    return null;
  }
}

/**
 * For Server Components (admin pages/layouts): returns the logged-in admin, or null.
 * Reads the cookie through next/headers, so it can only run on the server.
 */
export async function getAdminSession(): Promise<AdminPayload | null> {
  const { cookies } = await import('next/headers');
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  return token ? verifyAdminToken(token) : null;
}

/**
 * Guard for admin-only API routes. Use it at the top of every write/admin handler:
 *
 *   const denied = await requireAdmin(request);
 *   if (denied) return denied;
 *
 * Returns `null` when the request carries a valid admin cookie,
 * otherwise a ready-made 401 response to send back.
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const admin = token ? await verifyAdminToken(token) : null;
  if (admin) return null;
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}
