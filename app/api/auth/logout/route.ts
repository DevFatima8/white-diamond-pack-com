import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // 303 "See Other" makes the browser follow the redirect with a GET.
  // (The default 307 would repeat the POST against the /admin/login page.)
  const response = NextResponse.redirect(new URL('/admin/login', request.url), 303);
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // expire immediately
  });
  return response;
}
