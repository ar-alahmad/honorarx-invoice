import { NextResponse } from 'next/server';

/**
 * Session Invalidation endpoint (used by sendBeacon on tab close)
 * For JWT-only, we rely on client logout + normal expiry.
 * If you use DB sessions later, revoke/delete the session here.
 */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Clear remember-me cookie as a precaution
  res.cookies.set('honorarx-remember-me', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
