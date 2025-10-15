'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

/**
 * SessionManager - Handles automatic logout on browser close
 * This component ensures users are signed out when they close the browser
 * unless they explicitly chose "Remember Me" during login
 */
export function SessionManager() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    // Check if user chose "Remember Me"
    const rememberMe = localStorage.getItem('honorarx-remember-me');

    // Detect Safari browser
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // For Safari, be more aggressive about session clearing
    if (isSafari && !rememberMe) {
      // Clear any existing auth data on page load for Safari
      try {
        sessionStorage.clear();
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('next-auth') || key.includes('auth')) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('Could not clear Safari storage:', error);
      }
    }

    // If user didn't choose "Remember Me", set up browser close detection
    if (!rememberMe) {
      // Handle beforeunload event (browser close/refresh)
      const handleBeforeUnload = () => {
        // Clear Safari-specific storage
        try {
          // Clear all localStorage items related to authentication
          localStorage.removeItem('honorarx-remember-me');

          // Clear sessionStorage (Safari sometimes persists this)
          sessionStorage.clear();

          // Clear any NextAuth-related storage
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('next-auth') || key.includes('auth')) {
              localStorage.removeItem(key);
            }
          });
        } catch (error) {
          console.warn('Could not clear storage:', error);
        }

        // Use sendBeacon for reliable logout on page close
        if (navigator.sendBeacon) {
          // Send a logout request to the server
          navigator.sendBeacon(
            '/api/auth/signout',
            JSON.stringify({
              reason: 'browser_close',
            })
          );
        }
      };

      // Add event listener for browser close only
      window.addEventListener('beforeunload', handleBeforeUnload);

      // Cleanup function
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [session, status]);

  // This component doesn't render anything
  return null;
}
