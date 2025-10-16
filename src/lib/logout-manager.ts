'use client';

/**
 * Centralized Logout Manager
 * Handles all logout operations with proper coordination
 */
class LogoutManager {
  private static instance: LogoutManager;
  private inProgress = false;
  private logoutPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): LogoutManager {
    if (!LogoutManager.instance) {
      LogoutManager.instance = new LogoutManager();
    }
    return LogoutManager.instance;
  }

  isLogoutInProgress() {
    return this.inProgress;
  }

  /**
   * Main logout function - coordinates all logout operations
   */
  async logout(callbackUrl: string = '/anmelden'): Promise<void> {
    if (this.inProgress) return;
    this.inProgress = true;

    try {
      // Broadcast cross-tab once
      try {
        const bc = new BroadcastChannel('honorarx-auth');
        bc.postMessage('logout');
        bc.close();
        localStorage.setItem('honorarx-logout', '1');
        setTimeout(() => localStorage.removeItem('honorarx-logout'), 2000);
      } catch {}

      // Clear storages (keep your existing clear logic)
      try {
        sessionStorage.clear();
        Object.keys(localStorage).forEach((k) => {
          if (
            k.startsWith('next-auth') ||
            k.includes('auth') ||
            k.startsWith('honorarx')
          ) {
            localStorage.removeItem(k);
          }
        });
      } catch {}

      // Clear remember-me on server
      try {
        await fetch('/api/auth/remember-me', {
          method: 'DELETE',
          credentials: 'include',
        });
      } catch {}

      // NextAuth signOut + redirect
      const { signOut } = await import('next-auth/react');
      await signOut({ callbackUrl, redirect: true });
    } finally {
      this.inProgress = false;
    }
  }

  /**
   * Check if logout flag is set (for other components to check)
   */
  isLogoutFlagSet(): boolean {
    try {
      const flag = localStorage.getItem('honorarx-logout');
      return flag === '1';
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
      localStorage.removeItem('honorarx-logout');
      console.log('LogoutManager: Logout flag cleared');
    } catch (error) {
      console.warn('LogoutManager: Could not clear logout flag:', error);
    }
  }
}

// Export singleton instance
export const logoutManager = LogoutManager.getInstance();

// Export convenience function
export async function secureLogout(
  callbackUrl: string = '/anmelden'
): Promise<void> {
  return logoutManager.logout(callbackUrl);
}
