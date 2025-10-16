'use client';

import { signOut } from 'next-auth/react';

/**
 * Secure logout function with comprehensive cleanup
 * Handles all logout scenarios with proper error handling
 */
export async function secureLogout(callbackUrl: string = '/') {
  try {
    // Step 1: Clear client-side storage
    clearClientStorage();

    // Step 2: Use NextAuth's built-in signOut
    await signOut({
      redirect: false,
      callbackUrl,
    });

    // Step 3: Force redirect after cleanup
    window.location.href = callbackUrl;
  } catch (error) {
    console.error('Logout error:', error);

    // Fallback: Clear everything and force redirect
    clearClientStorage();
    window.location.href = callbackUrl;
  }
}

/**
 * Clear all client-side authentication data
 */
function clearClientStorage() {
  try {
    // Clear localStorage
    localStorage.removeItem('honorarx-remember-me');
    localStorage.removeItem('honorarx-session-duration');

    // Clear NextAuth-related localStorage items
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('next-auth') || key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear cookies (for non-httpOnly cookies)
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

      // Only clear non-httpOnly cookies
      if (name && !name.includes('next-auth')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure`;
      }
    });
  } catch (error) {
    console.warn('Could not clear all storage:', error);
  }
}

/**
 * Server-side logout endpoint handler
 * For use in API routes
 */
export async function handleServerLogout() {
  try {
    // This would be called from server-side logout endpoints
    // Additional server-side cleanup can be added here
    return { success: true };
  } catch (error) {
    console.error('Server logout error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Legacy function names for backward compatibility
 * @deprecated Use secureLogout instead
 */
export const handleLogout = secureLogout;
export const handleLogoutServer = secureLogout;
