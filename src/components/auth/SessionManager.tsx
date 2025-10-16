'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { logoutManager } from '@/lib/logout-manager';
import { InactivityWarning } from './InactivityWarning';

/**
 * SessionManager - Handles session management and browser close detection
 * For non-remember-me sessions, detects browser close and invalidates session
 */
export function SessionManager() {
  const { data: session, status } = useSession();
  const sessionStartTime = useRef<number | null>(null);
  const isRememberMe = useRef<boolean>(false);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);
  const warningTimeout = useRef<NodeJS.Timeout | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningSeconds, setWarningSeconds] = useState(30);

  // Handle logout
  const handleLogout = useCallback(() => {
    try {
      bcRef.current?.postMessage('logout');
      localStorage.setItem('honorarx-logout', '1');
      setTimeout(() => localStorage.removeItem('honorarx-logout'), 2000);
    } catch {}
    logoutManager.logout('/anmelden').catch(console.error);
  }, []);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    // Clear existing timers
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
    if (warningTimeout.current) {
      clearTimeout(warningTimeout.current);
    }
    
    // Hide warning if shown
    setShowWarning(false);

    // Only set inactivity timeout for non-remember-me sessions
    const rememberMe = localStorage.getItem('honorarx-remember-me');
    if (rememberMe !== 'true') {
      // Update last activity timestamp
      sessionStorage.setItem('honorarx-last-activity', Date.now().toString());
      
      // Show warning 30 seconds before logout (14.5 minutes)
      warningTimeout.current = setTimeout(
        () => {
          setShowWarning(true);
          setWarningSeconds(30);
        },
        14.5 * 60 * 1000
      ); // 14.5 minutes - show warning
      
      // Auto logout after 15 minutes
      inactivityTimeout.current = setTimeout(
        () => {
          handleLogout();
        },
        15 * 60 * 1000
      ); // 15 minutes of inactivity
    }
  }, [handleLogout]);

  // Handle stay logged in
  const handleStayLoggedIn = useCallback(() => {
    setShowWarning(false);
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Activity event handlers
  const handleActivity = useCallback(() => {
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      // CRITICAL: Check if logout is in progress - if so, don't interfere!
      if (
        logoutManager.isLogoutInProgress() ||
        logoutManager.isLogoutFlagSet()
      ) {
        return;
      }

      // Check if this is a remember-me session
      let rememberMe = localStorage.getItem('honorarx-remember-me');
      
      // For non-remember-me sessions, check if browser was closed
      if (rememberMe !== 'true') {
        const browserSessionId = sessionStorage.getItem('honorarx-browser-session-id');
        const lastBrowserSessionId = localStorage.getItem('honorarx-last-browser-session-id');
        
        // If no browser session ID in sessionStorage, this is a fresh browser session
        if (!browserSessionId) {
          // Check if we had a previous session that should be invalidated
          if (lastBrowserSessionId) {
            logoutManager.logout('/anmelden').catch(console.error);
            return;
          }
          
          // Create new browser session ID
          const newSessionId = Date.now().toString() + Math.random().toString(36);
          sessionStorage.setItem('honorarx-browser-session-id', newSessionId);
          localStorage.setItem('honorarx-last-browser-session-id', newSessionId);
        }
      }

      // Store session start time
      sessionStartTime.current = Date.now();

      // If localStorage is empty but we have a session, determine remember-me based on session duration
      if (!rememberMe && session) {
        const sessionExpiry = new Date(
          session.expires || Date.now() + 2 * 60 * 60 * 1000
        );
        const now = new Date();
        const sessionDuration = sessionExpiry.getTime() - now.getTime();
        const isLongSession = sessionDuration > 12 * 60 * 60 * 1000; // More than 12 hours

        rememberMe = isLongSession ? 'true' : 'false';
        localStorage.setItem('honorarx-remember-me', rememberMe);
        localStorage.setItem(
          'honorarx-session-duration',
          isLongSession ? '24h' : '2h'
        );
      }

      isRememberMe.current = rememberMe === 'true';

      // Set up heartbeat for non-remember-me sessions
      if (rememberMe !== 'true') {

        // Store session start time for age checking
        const sessionStartTime = Date.now();
        sessionStorage.setItem(
          'honorarx-session-start-time',
          sessionStartTime.toString()
        );

        // Store a flag in sessionStorage that we're active
        sessionStorage.setItem('honorarx-session-active', 'true');
        sessionStorage.setItem(
          'honorarx-session-heartbeat',
          Date.now().toString()
        );

        // Set up inactivity tracking
        resetInactivityTimer();

        // Add activity event listeners
        const events = [
          'mousedown',
          'mousemove',
          'keypress',
          'scroll',
          'touchstart',
          'click',
        ];
        events.forEach((event) => {
          document.addEventListener(event, handleActivity, true);
        });

        // Set up heartbeat to keep session alive
        heartbeatInterval.current = setInterval(() => {
          const now = Date.now();
          sessionStorage.setItem('honorarx-session-heartbeat', now.toString());
        }, 10000); // Every 10 seconds
      }
    }
  }, [session, status, handleActivity, resetInactivityTimer]);

  // Cross-tab sync (BroadcastChannel + storage fallback)
  useEffect(() => {
    bcRef.current = new BroadcastChannel('honorarx-auth');
    bcRef.current.onmessage = (e) => {
      if (e?.data === 'logout') {
        logoutManager.logout('/anmelden').catch(console.error);
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'honorarx-logout' && e.newValue === '1') {
        logoutManager.logout('/anmelden').catch(console.error);
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      try {
        bcRef.current?.close();
      } catch {}
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Check if session should be invalidated on page load
  useEffect(() => {
    if (status === 'authenticated' && session) {
      // CRITICAL: Check if logout is in progress - if so, don't interfere!
      if (
        logoutManager.isLogoutInProgress() ||
        logoutManager.isLogoutFlagSet()
      ) {
        return;
      }

      const rememberMe = localStorage.getItem('honorarx-remember-me');

      // For non-remember-me sessions, check if we should invalidate
      if (rememberMe !== 'true') {
        const currentTime = Date.now();
        
        // Check browser session ID
        const browserSessionId = sessionStorage.getItem('honorarx-browser-session-id');
        const lastBrowserSessionId = localStorage.getItem('honorarx-last-browser-session-id');
        
        // If browser session IDs don't match, browser was closed
        if (!browserSessionId || browserSessionId !== lastBrowserSessionId) {
          try {
            bcRef.current?.postMessage('logout');
            localStorage.setItem('honorarx-logout', '1');
            setTimeout(() => localStorage.removeItem('honorarx-logout'), 2000);
          } catch {}
          logoutManager.logout('/anmelden').catch(console.error);
          return;
        }
        
        // Check session start time
        const sessionStartTime = sessionStorage.getItem(
          'honorarx-session-start-time'
        );

        // Check last activity time for inactivity timeout
        const lastActivity = sessionStorage.getItem('honorarx-last-activity');
        if (lastActivity) {
          const inactivityDuration = currentTime - parseInt(lastActivity);
          const maxInactivity = 15 * 60 * 1000; // 15 minutes
          
          if (inactivityDuration > maxInactivity) {
            try {
              bcRef.current?.postMessage('logout');
              localStorage.setItem('honorarx-logout', '1');
              setTimeout(() => localStorage.removeItem('honorarx-logout'), 2000);
            } catch {}
            logoutManager.logout('/anmelden').catch(console.error);
            return;
          }
        }

        // Additional validation: check if session start time exists
        if (!sessionStartTime) {
          try {
            bcRef.current?.postMessage('logout');
            localStorage.setItem('honorarx-logout', '1');
            setTimeout(() => localStorage.removeItem('honorarx-logout'), 2000);
          } catch {}
          logoutManager.logout('/anmelden').catch(console.error);
          return;
        }

        // Check if session is too old (more than 2 hours)
        const sessionAge = currentTime - parseInt(sessionStartTime);
        const maxSessionAge = 2 * 60 * 60 * 1000; // 2 hours maximum

        if (sessionAge > maxSessionAge) {
          try {
            bcRef.current?.postMessage('logout');
            localStorage.setItem('honorarx-logout', '1');
            setTimeout(() => localStorage.removeItem('honorarx-logout'), 2000);
          } catch {}
          logoutManager.logout('/anmelden').catch(console.error);
          return;
        }
      }
    }
  }, [session, status]);

  // Handle browser close for non-remember-me sessions
  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    const rememberMe = localStorage.getItem('honorarx-remember-me');

    // If user didn't choose "Remember Me", set up browser close detection
    if (rememberMe !== 'true') {
      const handleBeforeUnload = () => {

        // Clear session flags
        sessionStorage.removeItem('honorarx-session-active');
        sessionStorage.removeItem('honorarx-session-heartbeat');

        // Clear client-side storage
        try {
          localStorage.removeItem('honorarx-remember-me');
          sessionStorage.clear();

          // Clear NextAuth-related localStorage items
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('next-auth') || key.includes('auth')) {
              localStorage.removeItem(key);
            }
          });

          // Send a request to invalidate the session on the server
          // Use sendBeacon for reliable delivery even when page is unloading
          const formData = new FormData();
          formData.append('action', 'invalidate-session');

          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/auth/invalidate-session', formData);
          } else {
            // Fallback for browsers that don't support sendBeacon
            fetch('/api/auth/invalidate-session', {
              method: 'POST',
              body: formData,
              keepalive: true,
            }).catch(() => {
              // Ignore errors during page unload
            });
          }
        } catch {
          // Ignore errors during page unload
        }
      };

      const handlePageHide = () => {
        /* mirror your beforeunload cleanup */
      };
      const handleVisibility = () => {
        if (document.visibilityState === 'hidden') handlePageHide();
      };
      const handleFreeze = () => handlePageHide();

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('pagehide', handlePageHide);
      document.addEventListener('visibilitychange', handleVisibility);
      document.addEventListener?.(
        'freeze',
        handleFreeze as EventListener
      );

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('pagehide', handlePageHide);
        document.removeEventListener('visibilitychange', handleVisibility);
        document.removeEventListener?.(
          'freeze',
          handleFreeze as EventListener
        );
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
        }
        if (inactivityTimeout.current) {
          clearTimeout(inactivityTimeout.current);
        }

        // Remove activity event listeners
        const events = [
          'mousedown',
          'mousemove',
          'keypress',
          'scroll',
          'touchstart',
          'click',
        ];
        events.forEach((event) => {
          document.removeEventListener(event, handleActivity, true);
        });
      };
    }
  }, [session, status, handleActivity]);

  // Check for session validity periodically
  useEffect(() => {
    const checkSessionValidity = () => {
      if (status === 'authenticated' && session) {
        const rememberMe = localStorage.getItem('honorarx-remember-me');

        // If this is not a remember-me session and we have a session start time
        if (!rememberMe && sessionStartTime.current) {
          const sessionDuration = Date.now() - sessionStartTime.current;
          const maxSessionDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

          // If session has been active for more than 2 hours, log out
          if (sessionDuration > maxSessionDuration) {
            try {
              bcRef.current?.postMessage('logout');
              localStorage.setItem('honorarx-logout', '1');
              setTimeout(
                () => localStorage.removeItem('honorarx-logout'),
                2000
              );
            } catch {}
            logoutManager.logout('/anmelden').catch(console.error);
          }
        }
      }
    };

    // Check immediately and then every minute
    checkSessionValidity();
    const interval = setInterval(checkSessionValidity, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [session, status]);

  return (
    <>
      {showWarning && (
        <InactivityWarning
          secondsRemaining={warningSeconds}
          onStayLoggedIn={handleStayLoggedIn}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
