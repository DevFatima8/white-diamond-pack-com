import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

/**
 * Runs before every /admin page request.
 *  - not logged in → redirect to /admin/login?callbackUrl=<page they wanted>
 *  - logged in and visiting /admin/login → straight to the dashboard
 * (Admin pages ALSO check the session themselves; API routes use requireAdmin.)
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isLoggedIn = token ? (await verifyAdminToken(token)) !== null : false;

  if (pathname === '/admin/login') {
    return isLoggedIn ? NextResponse.redirect(new URL('/admin', request.url)) : NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
