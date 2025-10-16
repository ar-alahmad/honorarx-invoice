'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

interface SessionProviderProps {
  children: React.ReactNode;
}

/**
 * SessionProvider wrapper for NextAuth v5
 * Provides session context to all child components
 */
export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      refetchInterval={15 * 60} // Refetch every 15 minutes (less frequent)
      refetchOnWindowFocus={false} // Disable refetch on window focus for better performance
      refetchWhenOffline={false}>
      {' '}
      {/* Disable refetch when offline */}
      {children}
    </NextAuthSessionProvider>
  );
}
