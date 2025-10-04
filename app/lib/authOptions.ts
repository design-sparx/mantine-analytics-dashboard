import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

// Helper function to refresh the token
async function refreshAccessToken(token: JWT) {
  try {
    console.log('Token before refresh attempt:', token);

    // Check if accessToken exists
    if (!token.accessToken) {
      console.error('No access token available for refresh');
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`,
        },
        body: JSON.stringify({
          token: token.accessToken,
        }),
      },
    );

    // Handle error response properly
    if (!response.ok) {
      console.error('Refresh token failed with status:', response.status);
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      console.error('Refresh token error response:', errorData);
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }

    // Parse response body
    const responseText = await response.text();
    console.log('Refresh token raw response:', responseText);

    let refreshedTokens;
    try {
      refreshedTokens = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('Failed to parse refresh token response as JSON:', responseText);
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }

    console.log('Refreshed tokens response:', refreshedTokens);

    // Validate that we received a new token
    if (!refreshedTokens.token && !refreshedTokens.accessToken) {
      console.error('No token in refresh response. Response keys:', Object.keys(refreshedTokens));
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }

    const newToken = refreshedTokens.token || refreshedTokens.accessToken;

    // Update permissions from the new token if needed
    let permissions = [];
    if (newToken) {
      try {
        const payload = JSON.parse(
          Buffer.from(newToken.split('.')[1], 'base64').toString(),
        );
        permissions = payload.permission || [];
        console.log('Decoded permissions from refreshed token:', permissions);
      } catch (e) {
        console.error('Error decoding refreshed JWT:', e);
      }
    }

    console.log('✅ Token refresh successful');
    return {
      ...token,
      accessToken: newToken,
      expiration: refreshedTokens.expiration,
      permissions: permissions,
      roles: refreshedTokens.roles || token.roles,
    };
  } catch (error) {
    console.error('Error refreshing token:', error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

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
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
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

          // If your JWT already contains the permissions
          // You can extract the payload portion without validating the signature
          // (NextAuth will handle token validation)
          const token = response.token;
          let permissions = [];

          if (token) {
            try {
              // Split the token and decode the payload portion
              const payload = JSON.parse(
                Buffer.from(token.split('.')[1], 'base64').toString(),
              );
              permissions = payload.permission || [];
            } catch (e) {
              console.error('Error decoding JWT:', e);
            }
          }

          // Map the backend response to the NextAuth user object
          const user = {
            id: response.user.userId,
            userName: response.user.username,
            email: response.user.email,
            token: response.token,
            roles: response.roles,
            permissions: permissions,
            expiration: response.expiration,
          };

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
    maxAge: 60 * 60, // 60 minutes (1 hour) - matches backend JWT expiration
    updateAge: 5 * 60, // Update session every 5 minutes to trigger token refresh check
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
        token.permissions = user.permissions;
        token.expiration = user.expiration;
        return token;
      }

      // Return the previous token if the access token has not expired yet
      if (token.expiration && new Date(token.expiration) > new Date()) {
        console.log('Token not expired, returning existing token');
        return token;
      }

      if (!token.accessToken) {
        console.error('No access token available for refresh');
        return {
          ...token,
          error: 'RefreshAccessTokenError',
        };
      }

      console.log('Token expired, attempting refresh');

      // Access token has expired, try to refresh it
      return refreshAccessToken(token);
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
        session.permissions = token.permissions;
        // @ts-ignore
        session.expiration = token.expiration;

        // Add refresh token error to session if it exists
        if (token.error) {
          // @ts-ignore
          session.error = token.error;
        }
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
};
