import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * Middleware for route protection using auth() (reliable)
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  const PROTECTED = [
    /^\/dashboard/,
    /^\/rechnung-erstellen/,
    /^\/rechnungen/,
    /^\/profil/,
    /^\/api\/users/,
  ];
  const AUTH_PAGES = [/^\/anmelden$/, /^\/registrieren$/];

  const isProtected = PROTECTED.some((re) => re.test(pathname));
  const isAuthPage = AUTH_PAGES.some((re) => re.test(pathname));

  if (isProtected && !session?.user) {
    const url = req.nextUrl.clone();
    url.pathname = '/anmelden';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && session?.user) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  return res;
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|api/auth).*)'],
};
