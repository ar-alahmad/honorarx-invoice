import { NextResponse } from 'next/server';

/**
 * Remember Me API endpoint
 * Sets/clears an httpOnly cookie as the server-side source of truth
 */
export async function POST() {
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
