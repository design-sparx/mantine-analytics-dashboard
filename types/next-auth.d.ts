import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extends the built-in Session interface
   */
  interface Session {
    user: User;
  }

  /**
   * Extends the built-in User interface
   */
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT interface
   */
  interface JWT {
    id: string;
    role: string;
  }
}
