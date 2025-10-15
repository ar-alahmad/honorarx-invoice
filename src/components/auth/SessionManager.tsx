'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

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
    
    // If user didn't choose "Remember Me", set up browser close detection
    if (!rememberMe) {
      // Set a flag to track if the page is being closed
      let isPageClosing = false;

      // Handle beforeunload event (browser close/refresh)
      const handleBeforeUnload = () => {
        isPageClosing = true;
        
        // Use sendBeacon for reliable logout on page close
        if (navigator.sendBeacon) {
          // Send a logout request to the server
          navigator.sendBeacon('/api/auth/signout', JSON.stringify({
            reason: 'browser_close'
          }));
        }
      };

      // Handle page visibility change (tab switch, minimize, etc.)
      const handleVisibilityChange = () => {
        if (document.hidden && !isPageClosing) {
          // Page is hidden but not closing - could be tab switch
          // Set a timeout to sign out if page stays hidden for too long
          const timeoutId = setTimeout(() => {
            if (document.hidden) {
              signOut({ callbackUrl: '/' });
            }
          }, 5 * 60 * 1000); // 5 minutes timeout

          // Clear timeout when page becomes visible again
          const handleVisibilityBack = () => {
            clearTimeout(timeoutId);
            document.removeEventListener('visibilitychange', handleVisibilityBack);
          };

          document.addEventListener('visibilitychange', handleVisibilityBack);
        }
      };

      // Handle page focus/blur events
      const handlePageBlur = () => {
        // Set a timeout to sign out if page loses focus for too long
        const timeoutId = setTimeout(() => {
          if (!document.hasFocus()) {
            signOut({ callbackUrl: '/' });
          }
        }, 10 * 60 * 1000); // 10 minutes timeout

        // Clear timeout when page regains focus
        const handlePageFocus = () => {
          clearTimeout(timeoutId);
          window.removeEventListener('focus', handlePageFocus);
        };

        window.addEventListener('focus', handlePageFocus);
      };

      // Add event listeners
      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('blur', handlePageBlur);

      // Cleanup function
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('blur', handlePageBlur);
      };
    }
  }, [session, status]);

  // This component doesn't render anything
  return null;
}