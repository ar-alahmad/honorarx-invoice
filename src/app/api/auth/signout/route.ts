import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST() {
  try {
    const session = await auth();

    if (session?.user) {
      // Log the logout event
      console.log(`User ${session.user.id} signed out due to browser close`);

      // Here you could add additional logout logic like:
      // - Logging the logout event to a database
      // - Invalidating any server-side sessions
      // - Clearing any cached data
    }

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json(
      { error: 'Failed to process logout' },
      { status: 500 }
    );
  }
}
