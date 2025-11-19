import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { PATH_AUTH } from '@/routes';

// NextAuth v5 server-side utilities
export async function getSession() {
  return await auth();
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(PATH_AUTH.signin);
  }

  return user;
}

// Note: Client-side auth operations (register, login, profile updates, etc.)
// are now handled by the new API hooks in lib/api/hooks/auth.ts
