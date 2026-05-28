import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  // Only apply auth to /admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const adminToken = req.cookies.get('admin_token');
    const url = req.nextUrl.clone();

    // If no token exists, redirect to login page
    if (!adminToken) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Verify token matches credentials
    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'password';
    const expectedToken = `${expectedUser}:${expectedPassword}`;

    if (adminToken.value !== expectedToken) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
