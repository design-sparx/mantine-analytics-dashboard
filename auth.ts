import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: 'user-001',
    name: 'Kelvin Kiprop',
    email: 'demo@example.com',
    password: 'demo123',
    role: 'Admin',
  },
  {
    id: 'user-002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'demo123',
    role: 'User',
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('🔐 Login attempt with:', {
            email: credentials?.email,
            password: credentials?.password ? '***' : 'missing'
          });

          // Simple mock authentication
          const user = MOCK_USERS.find(
            (u) =>
              u.email === credentials?.email &&
              u.password === credentials?.password
          );

          if (!user) {
            console.log('❌ Invalid credentials - no matching user found');
            console.log('Available emails:', MOCK_USERS.map(u => u.email));
            return null;
          }

          console.log('✅ Login successful for:', user.email);

          // Return user object (without password)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
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
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
