import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValidToken = token ? await verifyAdminToken(token) : null;

    const isLoginPage = pathname === '/admin/login';

    // If user is accessing login page:
    if (isLoginPage) {
      // If already logged in with valid token, redirect to admin dashboard
      if (isValidToken) {
        return NextResponse.redirect(new URL('/admin/products', request.url));
      }
      // Otherwise allow them to see the login page
      return NextResponse.next();
    }

    // For all other /admin routes (e.g. /admin, /admin/products, etc.):
    if (!isValidToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If accessing root /admin, redirect directly to /admin/products
    if (pathname === '/admin' || pathname === '/admin/') {
      return NextResponse.redirect(new URL('/admin/products', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
