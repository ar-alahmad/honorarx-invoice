import { NextResponse } from 'next/server';

/**
 * Remember Me API endpoint
 * Sets/clears an httpOnly cookie as the server-side source of truth
 * Called BEFORE authentication to set cookie for JWT callback to read
 */
export async function POST() {
  // NOTE: No auth check here because this is called BEFORE signIn() during login
  // The remember-me cookie is only read by the server-side JWT callback
  // and doesn't grant access by itself - it just influences token expiry
  const res = NextResponse.json({ ok: true });
  res.cookies.set('honorarx-remember-me', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

export async function DELETE() {
  // DELETE can be called during logout, so we don't require auth here
  // (user might already be logged out when this is called)
  const res = NextResponse.json({ ok: true });
  res.cookies.set('honorarx-remember-me', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Expire immediately
  });
  return res;
}
