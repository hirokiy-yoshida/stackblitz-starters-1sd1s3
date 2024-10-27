import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { Role } from '@prisma/client';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 管理者専用ページの保護
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // 店舗管理者専用ページの保護
    if (path.startsWith('/shop') && token?.role !== 'SHOP_MANAGER') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/shop/:path*',
    '/calendar',
    '/reservations',
  ],
};