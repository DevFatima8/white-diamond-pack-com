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
    return isLoggedIn ? NextResponse.redirect(new URL('/admin', request.url)) : adminPage(request);
  }

  if (!isLoggedIn) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return adminPage(request);
}

/**
 * Let the request through, tagged with `x-wd-area: admin`. The root layout reads this
 * tag and skips the legacy Bootstrap/template stylesheets on admin pages (their
 * `!important` utilities like .p-5 clash with Tailwind's classes of the same name).
 * TODO(Phase 4): remove together with the legacy CSS.
 */
function adminPage(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-wd-area', 'admin');
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/admin/:path*'],
};
