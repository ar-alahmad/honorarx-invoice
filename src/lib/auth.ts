import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from './db';
import { verifyPassword } from './encryption';

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
    maxAge: 2 * 60 * 60, // 2 hours default (will be overridden by JWT callback)
    updateAge: 5 * 60, // 5 minutes in seconds
  },
  jwt: {
    maxAge: 2 * 60 * 60, // 2 hours default (will be overridden by JWT callback)
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.iat = Math.floor(Date.now() / 1000);
        token.rememberMe = (user as { rememberMe?: boolean }).rememberMe;

        // Set session duration based on remember me preference
        if (token.rememberMe) {
          token.maxAge = 24 * 60 * 60; // 24 hours for remember me
          token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // Set explicit expiry
        } else {
          token.maxAge = 2 * 60 * 60; // 2 hours for regular sessions
          token.exp = Math.floor(Date.now() / 1000) + 2 * 60 * 60; // Set explicit expiry
        }
      }

      // Handle session refresh
      if (trigger === 'update') {
        token.iat = Math.floor(Date.now() / 1000);
        // Update expiry time on refresh
        if (token.rememberMe) {
          token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
        } else {
          token.exp = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        // Pass remember me preference to session for client-side use
        (session as any).rememberMe = token.rememberMe;
      }
      return session;
    },
  },
  pages: {
    signIn: '/anmelden',
  },
  events: {
    async signIn({ user, account, profile }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth signIn event triggered for user:', user?.id);
      }
    },
    async signOut({ token }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth signOut event triggered for user:', token?.id);
      }
    },
    async session({ session, token }) {
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
