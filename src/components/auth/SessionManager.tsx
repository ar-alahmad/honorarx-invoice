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
  const isWarningShowing = useRef(false);
  const isInitialized = useRef(false);

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
      const now = Date.now();
      sessionStorage.setItem('honorarx-last-activity', now.toString());

      // Show warning 30 seconds before logout (9.5 minutes)
      warningTimeout.current = setTimeout(
        () => {
          isWarningShowing.current = true;
          setShowWarning(true);
          setWarningSeconds(30);
        },
        9.5 * 60 * 1000
      ); // 9.5 minutes - show warning

      // Auto logout after 10 minutes
      inactivityTimeout.current = setTimeout(
        () => {
          handleLogout();
        },
        10 * 60 * 1000
      ); // 10 minutes of inactivity
    }
  }, [handleLogout]);

  // Handle stay logged in
  const handleStayLoggedIn = useCallback(() => {
    setShowWarning(false);
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Activity event handlers
  const handleActivity = useCallback(() => {
    // If warning is showing, dismiss it
    if (isWarningShowing.current) {
      isWarningShowing.current = false;
      setShowWarning(false);
    }
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Session initialization effect - ONLY runs once on mount or when status changes to authenticated
  useEffect(() => {
    if (status !== 'authenticated' || !session) {
      isInitialized.current = false;
      return;
    }

    // Only initialize once per session
    if (isInitialized.current) return;

    // CRITICAL: Check if logout is in progress - if so, don't interfere!
    if (logoutManager.isLogoutInProgress() || logoutManager.isLogoutFlagSet()) {
      return;
    }

    // Get remember-me preference
    const rememberMe = localStorage.getItem('honorarx-remember-me');

    // Browser close detection for non-remember-me sessions only
    if (rememberMe !== 'true') {
      const browserSessionId = sessionStorage.getItem(
        'honorarx-browser-session-id'
      );
      const hadPreviousSession = localStorage.getItem('honorarx-had-session');

      // sessionStorage is cleared when browser closes, so if browserSessionId is missing,
      // this is either: (1) first visit, or (2) browser was closed and reopened
      if (!browserSessionId) {
        // If hadPreviousSession flag exists, the browser was closed -> logout immediately
        if (hadPreviousSession === 'true') {
          localStorage.removeItem('honorarx-had-session');
          logoutManager.logout('/anmelden').catch(console.error);
          return;
        }

        // First time login: create browser session ID and set flag
        const newSessionId = Date.now().toString() + Math.random().toString(36);
        sessionStorage.setItem('honorarx-browser-session-id', newSessionId);
        localStorage.setItem('honorarx-had-session', 'true');
      }
    } else {
      // Remember-me sessions persist across browser closes, so clear the detection flag
      localStorage.removeItem('honorarx-had-session');
    }

    // Store session start time
    sessionStartTime.current = Date.now();
    isRememberMe.current = rememberMe === 'true';

    // Mark as initialized
    isInitialized.current = true;

    // Set up heartbeat and inactivity tracking for non-remember-me sessions
    if (rememberMe !== 'true') {
      // Store session start time for age checking
      sessionStorage.setItem(
        'honorarx-session-start-time',
        Date.now().toString()
      );
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
        sessionStorage.setItem(
          'honorarx-session-heartbeat',
          Date.now().toString()
        );
      }, 10000); // Every 10 seconds

      // Cleanup function - ONLY runs on unmount or re-authentication
      return () => {
        isInitialized.current = false;
        if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
        if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
        if (warningTimeout.current) clearTimeout(warningTimeout.current);
        events.forEach((event) => {
          document.removeEventListener(event, handleActivity, true);
        });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Note: 'session' is intentionally excluded from dependencies to prevent re-initialization on session object changes
  }, [status, handleActivity, resetInactivityTimer]);

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

  // Check session validity on page load (only runs once on mount)
  useEffect(() => {
    if (status !== 'authenticated' || !session) return;
    if (logoutManager.isLogoutInProgress() || logoutManager.isLogoutFlagSet())
      return;

    const rememberMe = localStorage.getItem('honorarx-remember-me');

    // For non-remember-me sessions, validate on page load
    if (rememberMe !== 'true') {
      const currentTime = Date.now();
      const sessionStartTime = sessionStorage.getItem(
        'honorarx-session-start-time'
      );
      const lastActivity = sessionStorage.getItem('honorarx-last-activity');

      // Check last activity for inactivity timeout
      if (lastActivity) {
        const inactivityDuration = currentTime - parseInt(lastActivity);
        const maxInactivity = 10 * 60 * 1000; // 10 minutes

        if (inactivityDuration > maxInactivity) {
          logoutManager.logout('/anmelden').catch(console.error);
          return;
        }
      }

      // Check if session is too old (more than 2 hours)
      if (sessionStartTime) {
        const sessionAge = currentTime - parseInt(sessionStartTime);
        const maxSessionAge = 2 * 60 * 60 * 1000; // 2 hours maximum

        if (sessionAge > maxSessionAge) {
          logoutManager.logout('/anmelden').catch(console.error);
          return;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Periodic session validity check (only for non-remember-me sessions)
  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    const rememberMe = localStorage.getItem('honorarx-remember-me');
    if (rememberMe === 'true') return; // Skip for remember-me sessions

    const checkSessionValidity = () => {
      if (sessionStartTime.current) {
        const sessionDuration = Date.now() - sessionStartTime.current;
        const maxSessionDuration = 2 * 60 * 60 * 1000; // 2 hours

        // If session has been active for more than 2 hours, log out
        if (sessionDuration > maxSessionDuration) {
          logoutManager.logout('/anmelden').catch(console.error);
        }
      }
    };

    // Check immediately and then every minute
    checkSessionValidity();
    const interval = setInterval(checkSessionValidity, 60 * 1000);

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
