'use client';

import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';

export function SessionManager() {
  const { data: session, status } = useSession();
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const lastActivity = useRef<number>(Date.now());

  useEffect(() => {
    if (status === 'loading') return;

    // Check if user chose "remember me"
    const rememberMe = localStorage.getItem('honorarx-remember-me') === 'true';

    // Function to handle beforeunload (browser close/refresh)
    const handleBeforeUnload = () => {
      if (session && !rememberMe) {
        // Clear session data from localStorage/sessionStorage for non-remembered users
        localStorage.removeItem('next-auth.session-token');
        sessionStorage.clear();
      }
    };

    // Function to handle visibility change (tab switch/close)
    const handleVisibilityChange = () => {
      if (document.hidden && session && !rememberMe) {
        // Start inactivity timer for non-remembered users
        startInactivityTimer();
      } else if (!document.hidden) {
        // Clear inactivity timer when user returns
        clearInactivityTimer();
        lastActivity.current = Date.now();
      }
    };

    // Function to handle page unload
    const handleUnload = () => {
      if (session && !rememberMe) {
        // Force sign out on page unload for non-remembered users
        signOut({ redirect: false });
      }
    };

    // Function to track user activity
    const handleActivity = () => {
      lastActivity.current = Date.now();
      if (!rememberMe) {
        clearInactivityTimer();
        startInactivityTimer();
      }
    };

    // Function to start inactivity timer
    const startInactivityTimer = () => {
      clearInactivityTimer();
      inactivityTimer.current = setTimeout(() => {
        if (session && !rememberMe) {
          signOut({ redirect: true });
        }
      }, 30 * 60 * 1000); // 30 minutes of inactivity
    };

    // Function to clear inactivity timer
    const clearInactivityTimer = () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = null;
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Start inactivity timer if user is logged in and didn't choose remember me
    if (session && !rememberMe) {
      startInactivityTimer();
    }

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      clearInactivityTimer();
    };
  }, [session, status]);

  // Check for session expiration on mount and periodically
  useEffect(() => {
    if (!session) return;

    const rememberMe = localStorage.getItem('honorarx-remember-me') === 'true';
    const maxAge = rememberMe ? 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000; // 24h if remember me, 2h otherwise

    const checkSessionExpiry = () => {
      const now = Date.now();
      const sessionStart = session.user ? Date.now() : 0; // This is a simplified check
      
      // If session is older than maxAge, sign out
      if (now - sessionStart > maxAge) {
        signOut({ redirect: true });
      }
    };

    // Check immediately
    checkSessionExpiry();

    // Check every 5 minutes
    const interval = setInterval(checkSessionExpiry, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [session]);

  return null; // This component doesn't render anything
}
