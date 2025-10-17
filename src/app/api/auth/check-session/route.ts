import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';

/**
 * Debug endpoint to check session and remember-me cookie status
 */
export async function GET() {
  const session = await auth();
  const cookieStore = await cookies();
  const rememberMeCookie = cookieStore.get('honorarx-remember-me');
  const allCookies = cookieStore.getAll();

  return NextResponse.json({
    session: {
      exists: !!session,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      } : null,
      expires: session?.expires,
    },
    rememberMeCookie: {
      exists: !!rememberMeCookie,
      value: rememberMeCookie?.value,
    },
    allCookies: allCookies.map(c => ({
      name: c.name,
      value: c.name.includes('remember') ? c.value : '[hidden]',
    })),
  });
}
