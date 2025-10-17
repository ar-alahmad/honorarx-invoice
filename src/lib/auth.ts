import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import { db } from './db';
import { verifyPassword } from './encryption';
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';

interface ExtendedToken extends JWT {
  rememberMe?: boolean;
  maxAge?: number;
  exp?: number;
}

interface ExtendedSession extends Session {
  rememberMe?: boolean;
}

interface ExtendedUser extends User {
  rememberMe?: boolean;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === 'development', // Only debug in development
  trustHost: true, // Critical for NextAuth v5
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await verifyPassword(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
          throw new Error('EMAIL_NOT_VERIFIED');
        }

        // Update last login
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          rememberMe:
            (credentials as { rememberMe?: string | boolean }).rememberMe ===
              'true' ||
            (credentials as { rememberMe?: string | boolean }).rememberMe ===
              true,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days max (for remember-me sessions)
    updateAge: 5 * 60, // 5 minutes in seconds
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days max (for remember-me sessions)
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Server-side truth: httpOnly cookie set by /api/auth/remember-me
      const cookieStore = await cookies();
      const rememberCookie =
        cookieStore.get('honorarx-remember-me')?.value === 'true';

      // Persist the flag on the token so session() can read it
      const extendedToken = token as ExtendedToken;
      const extendedUser = user as ExtendedUser | undefined;
      
      extendedToken.rememberMe =
        rememberCookie ||
        extendedToken.rememberMe ||
        extendedUser?.rememberMe ||
        false;

      // Set session expiry based on remember-me
      const now = Math.floor(Date.now() / 1000);
      if (extendedToken.rememberMe) {
        // Remember me: 30 days - stays logged in until manual logout
        extendedToken.maxAge = 30 * 24 * 60 * 60;
        extendedToken.exp = now + 30 * 24 * 60 * 60;
      } else {
        // No remember me: 2 hours max, but client-side will handle browser close + 10min inactivity
        extendedToken.maxAge = 2 * 60 * 60;
        extendedToken.exp = now + 2 * 60 * 60;
      }

      if (trigger === 'update') {
        const now2 = Math.floor(Date.now() / 1000);
        extendedToken.exp =
          now2 + (extendedToken.rememberMe ? 30 * 24 * 60 * 60 : 2 * 60 * 60);
      }

      return token;
    },

    async session({ session, token }) {
      const extendedSession = session as ExtendedSession;
      const extendedToken = token as ExtendedToken;
      extendedSession.rememberMe = Boolean(extendedToken.rememberMe);
      
      // Add user ID to session
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      
      return extendedSession;
    },
  },
  pages: {
    signIn: '/anmelden',
  },
  events: {
    async signIn({ user }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth signIn event triggered for user:', user?.id);
      }
    },
    async signOut() {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth signOut event triggered');
      }
    },
    async session({ session }) {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          'NextAuth session event triggered for user:',
          session?.user?.id
        );
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.callback-url'
          : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Host-next-auth.csrf-token'
          : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
});
