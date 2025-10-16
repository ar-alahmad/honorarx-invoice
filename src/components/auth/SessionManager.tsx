'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { logoutManager } from '@/lib/logout-manager';

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

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }

    // Only set inactivity timeout for non-remember-me sessions
    const rememberMe = localStorage.getItem('honorarx-remember-me');
    if (rememberMe !== 'true') {
      inactivityTimeout.current = setTimeout(
        () => {
          console.log(
            'SessionManager: Inactivity timeout reached, logging out'
          );
          logoutManager.logout('/anmelden').catch(console.error);
        },
        15 * 60 * 1000
      ); // 15 minutes
    }
  }, []);

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
        console.log(
          'SessionManager: Logout in progress, skipping session setup'
        );
        return;
      }

      // Store session start time
      sessionStartTime.current = Date.now();

      // Check if this is a remember-me session
      let rememberMe = localStorage.getItem('honorarx-remember-me');

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

        console.log(
          'SessionManager: localStorage was empty, determined remember-me from session duration:',
          rememberMe
        );
      }

      isRememberMe.current = rememberMe === 'true';

      console.log('SessionManager: Session started');
      console.log('SessionManager: Remember Me value:', rememberMe);
      console.log('SessionManager: Remember Me boolean:', isRememberMe.current);
      console.log(
        'SessionManager: All localStorage keys:',
        Object.keys(localStorage)
      );
      console.log(
        'SessionManager: All sessionStorage keys:',
        Object.keys(sessionStorage)
      );

      // Set up heartbeat for non-remember-me sessions
      if (rememberMe !== 'true') {
        console.log(
          'SessionManager: Setting up browser close detection for non-remember-me session'
        );

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

        console.log(
          'SessionManager: Session start time set:',
          new Date(sessionStartTime).toLocaleString()
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
          console.log(
            'SessionManager: Heartbeat updated:',
            new Date(now).toLocaleTimeString()
          );
        }, 10000); // Every 10 seconds
      } else {
        console.log(
          'SessionManager: Remember Me session - no browser close detection'
        );
      }
    }
  }, [session, status, handleActivity, resetInactivityTimer]);

  // Check if session should be invalidated on page load
  useEffect(() => {
    if (status === 'authenticated' && session) {
      // CRITICAL: Check if logout is in progress - if so, don't interfere!
      if (
        logoutManager.isLogoutInProgress() ||
        logoutManager.isLogoutFlagSet()
      ) {
        console.log('SessionManager: Logout in progress, skipping validation');
        return;
      }

      const rememberMe = localStorage.getItem('honorarx-remember-me');

      console.log('SessionManager: Checking session validity on page load');
      console.log('SessionManager: Remember Me value:', rememberMe);

      // For non-remember-me sessions, check if we should invalidate
      if (rememberMe !== 'true') {
        // Check if this is a fresh page load (no sessionStorage from previous session)
        const sessionActive = sessionStorage.getItem('honorarx-session-active');
        const lastHeartbeat = sessionStorage.getItem(
          'honorarx-session-heartbeat'
        );
        const pageLoadTime = sessionStorage.getItem('honorarx-page-load-time');

        console.log('SessionManager: Session active flag:', sessionActive);
        console.log('SessionManager: Last heartbeat:', lastHeartbeat);
        console.log('SessionManager: Page load time:', pageLoadTime);

        // Check if this is a fresh browser session by checking session age
        const sessionStartTime = sessionStorage.getItem(
          'honorarx-session-start-time'
        );
        const currentTime = Date.now();

        console.log('SessionManager: Session start time:', sessionStartTime);
        console.log('SessionManager: Current time:', currentTime);

        // If no session start time, this is a fresh session
        if (!sessionStartTime) {
          console.log(
            'SessionManager: Fresh browser session detected, logging out'
          );
          logoutManager.logout('/anmelden').catch(console.error);
          return;
        }

        // Check if session is too old (more than 2 hours)
        const sessionAge = currentTime - parseInt(sessionStartTime);
        const maxSessionAge = 2 * 60 * 60 * 1000; // 2 hours for production

        console.log('SessionManager: Session age:', sessionAge, 'ms');
        console.log('SessionManager: Max session age:', maxSessionAge, 'ms');

        if (sessionAge > maxSessionAge) {
          console.log('SessionManager: Session too old, logging out');
          logoutManager.logout('/anmelden').catch(console.error);
          return;
        }

        // If no active session flag or heartbeat is too old, log out
        if (!sessionActive || !lastHeartbeat) {
          console.log(
            'SessionManager: No active session flag or heartbeat, logging out'
          );
          logoutManager.logout('/anmelden').catch(console.error);
          return;
        }

        const heartbeatAge = Date.now() - parseInt(lastHeartbeat);
        const maxHeartbeatAge = 30 * 1000; // 30 seconds - much more aggressive

        console.log('SessionManager: Heartbeat age:', heartbeatAge, 'ms');
        console.log(
          'SessionManager: Max heartbeat age:',
          maxHeartbeatAge,
          'ms'
        );

        if (heartbeatAge > maxHeartbeatAge) {
          console.log('SessionManager: Heartbeat too old, logging out');
          logoutManager.logout('/anmelden').catch(console.error);
          return;
        }

        console.log('SessionManager: Session is valid, continuing...');
      } else {
        console.log(
          'SessionManager: Remember Me session - skipping validation'
        );
      }
    }
  }, [session, status]);

  // Handle browser close for non-remember-me sessions
  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    const rememberMe = localStorage.getItem('honorarx-remember-me');

    console.log('SessionManager: Setting up browser close detection');
    console.log('SessionManager: Remember Me value:', rememberMe);

    // If user didn't choose "Remember Me", set up browser close detection
    if (rememberMe !== 'true') {
      console.log(
        'SessionManager: Setting up beforeunload listener for non-remember-me session'
      );
      const handleBeforeUnload = () => {
        console.log(
          'SessionManager: Browser closing, invalidating session for non-remember-me user'
        );

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
        } catch (error) {
          console.warn('Could not clear storage:', error);
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
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
    } else {
      console.log(
        'SessionManager: Remember Me session - no browser close detection needed'
      );
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
            console.log(
              'SessionManager: Session expired (2h limit), logging out'
            );
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

  return null;
}
