import Auth0 from 'next-auth/providers/auth0';
import { NextAuthOptions } from 'next-auth';

const {
  AUTH0_CLIENT_ID = '',
  AUTH0_CLIENT_SECRET = '',
  AUTH0_DOMAIN = '',
  AUTH0_NEXT_SECRET = '',
  AUTH0_ISSUER_BASE_URL = '',
} = process.env;

export const authOptions: NextAuthOptions = {
  secret: AUTH0_NEXT_SECRET,
  providers: [
    Auth0({
      clientId: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      issuer: AUTH0_ISSUER_BASE_URL,
    }),
  ],
};
