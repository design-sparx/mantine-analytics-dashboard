import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extends the built-in Session interface
   */
  interface Session {
    user: User;
    accessToken: string;
    roles: string[];
    permissions: string[];
    expiration: string;
    error?: string;
  }

  /**
   * Extends the built-in User interface
   */
  interface User {
    id: string;
    userName: string;
    email?: string | null;
    image?: string | null;
    avatar?: string | null;
    token: string;
    roles: string[];
    permissions: string[];
    expiration: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT interface
   */
  interface JWT {
    id: string;
    accessToken: string;
    roles: string[];
    permissions: string[];
    expiration: string;
    error?: string;
  }
}
