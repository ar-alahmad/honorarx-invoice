'use client';

import { signOut } from 'next-auth/react';

/**
 * Centralized Logout Manager
 * Handles all logout operations with proper coordination
 */
class LogoutManager {
  private static instance: LogoutManager;
  private isLoggingOut = false;
  private logoutPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): LogoutManager {
    if (!LogoutManager.instance) {
      LogoutManager.instance = new LogoutManager();
    }
    return LogoutManager.instance;
  }

  /**
   * Main logout function - coordinates all logout operations
   */
  async logout(callbackUrl: string = '/'): Promise<void> {
    // Prevent multiple simultaneous logout attempts
    if (this.isLoggingOut) {
      console.log('LogoutManager: Logout already in progress, waiting...');
      return this.logoutPromise || Promise.resolve();
    }

    this.isLoggingOut = true;
    this.logoutPromise = this.performLogout(callbackUrl);

    try {
      await this.logoutPromise;
    } finally {
      this.isLoggingOut = false;
      this.logoutPromise = null;
    }
  }

  private async performLogout(callbackUrl: string): Promise<void> {
    try {
      console.log('LogoutManager: Starting coordinated logout process');

      // Step 1: Set global logout flag
      this.setLogoutFlag();

      // Step 2: Clear all client-side storage
      this.clearClientStorage();

      // Step 3: Call NextAuth signOut
      console.log('LogoutManager: Calling NextAuth signOut');
      await signOut({
        redirect: false,
        callbackUrl,
      });

      // Step 4: Force redirect
      console.log('LogoutManager: Redirecting to:', callbackUrl);
      window.location.href = callbackUrl;
    } catch (error) {
      console.error('LogoutManager: Logout error:', error);

      // Fallback: Clear everything and force redirect
      this.clearClientStorage();
      window.location.href = callbackUrl;
    }
  }

  private setLogoutFlag(): void {
    try {
      localStorage.setItem('honorarx-logout-in-progress', 'true');
      localStorage.setItem('honorarx-logout-timestamp', Date.now().toString());
      console.log('LogoutManager: Logout flag set');
    } catch (error) {
      console.warn('LogoutManager: Could not set logout flag:', error);
    }
  }

  private clearClientStorage(): void {
    try {
      console.log('LogoutManager: Clearing all client-side storage');

      // Clear our custom localStorage items
      localStorage.removeItem('honorarx-remember-me');
      localStorage.removeItem('honorarx-session-duration');
      localStorage.removeItem('honorarx-logout-in-progress');
      localStorage.removeItem('honorarx-logout-timestamp');

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
        const name =
          eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

        // Only clear non-httpOnly cookies
        if (name && !name.includes('next-auth')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure`;
        }
      });

      console.log('LogoutManager: Storage cleared successfully');
    } catch (error) {
      console.warn('LogoutManager: Could not clear all storage:', error);
    }
  }

  /**
   * Check if logout is in progress
   */
  isLogoutInProgress(): boolean {
    return this.isLoggingOut;
  }

  /**
   * Check if logout flag is set (for other components to check)
   */
  isLogoutFlagSet(): boolean {
    try {
      const flag = localStorage.getItem('honorarx-logout-in-progress');
      const timestamp = localStorage.getItem('honorarx-logout-timestamp');

      if (flag === 'true' && timestamp) {
        const logoutTime = parseInt(timestamp);
        const now = Date.now();
        const timeDiff = now - logoutTime;

        // If logout flag is older than 30 seconds, consider it stale
        if (timeDiff > 30000) {
          localStorage.removeItem('honorarx-logout-in-progress');
          localStorage.removeItem('honorarx-logout-timestamp');
          return false;
        }

        return true;
      }

      return false;
    } catch (error) {
      console.warn('LogoutManager: Could not check logout flag:', error);
      return false;
    }
  }

  /**
   * Clear logout flag (for cleanup)
   */
  clearLogoutFlag(): void {
    try {
      localStorage.removeItem('honorarx-logout-in-progress');
      localStorage.removeItem('honorarx-logout-timestamp');
      console.log('LogoutManager: Logout flag cleared');
    } catch (error) {
      console.warn('LogoutManager: Could not clear logout flag:', error);
    }
  }
}

// Export singleton instance
export const logoutManager = LogoutManager.getInstance();

// Export convenience function
export async function secureLogout(callbackUrl: string = '/'): Promise<void> {
  return logoutManager.logout(callbackUrl);
}
