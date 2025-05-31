import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extends the built-in Session interface
   */
  interface Session {
    user?: IUser;
    accessToken: string;
    roles: string[];
    permissions: string[];
    expiration: string;
  }

  /**
   * Extends the built-in User interface
   */
  interface User {
    id: string;
    userName: string;
    email?: string;
    image?: string;
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
  }
}
