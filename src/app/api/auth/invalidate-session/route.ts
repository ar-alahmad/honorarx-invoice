import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * API endpoint to invalidate session when browser closes
 * This is called by the SessionManager when a non-remember-me session
 * detects browser close via beforeunload event
 */
export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'No active session' },
        { status: 401 }
      );
    }

    console.log('Session invalidation requested for user:', session.user.id);

    // Create a response that clears the session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Session invalidated',
    });

    // Clear the NextAuth session cookie
    const cookieName =
      process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token';

    response.cookies.set(cookieName, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
    });

    // Also clear the callback URL cookie
    const callbackCookieName =
      process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.callback-url'
        : 'next-auth.callback-url';

    response.cookies.set(callbackCookieName, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
    });

    console.log('Session cookies cleared for user:', session.user.id);

    return response;
  } catch (error) {
    console.error('Error invalidating session:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to invalidate session' },
      { status: 500 }
    );
  }
}

