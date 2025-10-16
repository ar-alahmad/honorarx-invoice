'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

/**
 * SessionManager - Simplified session management
 * Handles basic session validation and cleanup
 */
export function SessionManager() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only handle browser close logout for non-remember-me sessions
    if (status !== 'authenticated' || !session) return;

    const rememberMe = localStorage.getItem('honorarx-remember-me');

    // If user didn't choose "Remember Me", set up browser close detection
    if (!rememberMe) {
      const handleBeforeUnload = () => {
        // Clear authentication data on browser close
        try {
          localStorage.removeItem('honorarx-remember-me');
          sessionStorage.clear();

          // Clear NextAuth-related storage
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('next-auth') || key.includes('auth')) {
              localStorage.removeItem(key);
            }
          });
        } catch (error) {
          console.warn('Could not clear storage:', error);
        }

        // Notify server about logout
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            '/api/auth/signout',
            JSON.stringify({
              reason: 'browser_close',
            })
          );
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () =>
        window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [session, status]);

  return null;
}
