import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from './db';
import { verifyPassword } from './encryption';

export const { auth, handlers } = NextAuth({
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
    maxAge: 60 * 60, // 1 hour in seconds (shorter default session)
    updateAge: 15 * 60, // 15 minutes in seconds
  },
  jwt: {
    maxAge: 60 * 60, // 1 hour in seconds (shorter default JWT)
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.iat = Math.floor(Date.now() / 1000); // Set issued at time

        // Check if this is a sign-in with remember me
        const rememberMe = (user as { rememberMe?: boolean }).rememberMe;
        if (rememberMe) {
          // Extended session for remember me (24 hours)
          token.maxAge = 24 * 60 * 60;
        } else {
          // Short session for normal login (1 hour)
          token.maxAge = 60 * 60;
        }
      }

      // Handle session refresh
      if (trigger === 'update') {
        // Update the issued at time when session is refreshed
        token.iat = Math.floor(Date.now() / 1000);
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        // Check if token is expired
        const now = Math.floor(Date.now() / 1000);
        if (token.iat && now - token.iat > 24 * 60 * 60) {
          // Instead of returning null, we'll handle this in the client-side SessionManager
          // This ensures the session callback always returns a valid session object
          throw new Error('Session expired');
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/anmelden',
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60, // 24 hours
      },
    },
  },
});
