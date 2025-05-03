import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            },
          );

          if (!res.ok) {
            return null;
          }

          const response = await res.json();

          // Map the backend response to the NextAuth user object
          const user = {
            id: response.user.userId,
            name: response.user.username,
            email: response.user.email,
            token: response.token,
            roles: response.roles,
            expiration: response.expiration,
          };

          console.log({ user });

          return user;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        // Add custom fields from our user object to the JWT
        token.id = user.id;
        token.accessToken = user.token;
        token.roles = user.roles;
        token.expiration = user.expiration;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Add fields from token to session
        session.user.id = token.id as string;

        // Add custom fields to session
        // @ts-ignore - Adding custom properties
        session.accessToken = token.accessToken;
        // @ts-ignore
        session.roles = token.roles;
        // @ts-ignore
        session.expiration = token.expiration;
      }
      return session;
    },
    async signOut({ token, session }) {
      try {
        // You could add server-side logout logic here if needed
        // For example, invalidating the token on your backend
        if (token?.accessToken) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token.accessToken}`,
            },
            body: JSON.stringify({
              email: token.email,
            }),
          });
        }
      } catch (error) {
        console.error('Error during server-side logout:', error);
      }
      return true;
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this-in-production',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
