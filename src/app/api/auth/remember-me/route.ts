import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * Remember Me API endpoint
 * Sets/clears an httpOnly cookie as the server-side source of truth
 * Protected: Requires authentication to prevent unauthorized cookie manipulation
 */
export async function POST() {
  // Require authentication to set remember-me cookie
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
