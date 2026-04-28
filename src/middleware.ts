import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Unified PWA route protection
  if (pathname.startsWith('/app') && !pathname.startsWith('/app/login')) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/app/login', request.url));
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.redirect(new URL('/app/login', request.url));
    }

    // Role-based sub-route protection
    if (pathname.startsWith('/app/admin') && session.role !== 'admin') {
      return NextResponse.redirect(new URL('/app/login', request.url));
    }
    if (pathname.startsWith('/app/employee') && session.role !== 'employee') {
      return NextResponse.redirect(new URL('/app/login', request.url));
    }
  }

  // Legacy route protection (keep for now to avoid breaking existing users)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));
    const session = await verifyToken(token);
    if (!session || session.role !== 'admin') return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (pathname.startsWith('/employee') && !pathname.startsWith('/employee/login')) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.redirect(new URL('/employee/login', request.url));
    const session = await verifyToken(token);
    if (!session || session.role !== 'employee') return NextResponse.redirect(new URL('/employee/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/employee/:path*', '/app/:path*'],
};
