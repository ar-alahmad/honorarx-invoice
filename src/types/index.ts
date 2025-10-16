/**
 * TypeScript Type Definitions
 * Centralized type definitions for the application
 */

// Re-export types from components
export type * from '../components/effects/background/types';

// NextAuth Session Extensions
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
    rememberMe?: boolean;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    rememberMe?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    rememberMe?: boolean;
  }
}
