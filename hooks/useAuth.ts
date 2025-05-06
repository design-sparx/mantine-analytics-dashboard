'use client';

import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const logout = async () => {
    await signOut({ redirect: false });
    router.push(PATH_AUTH.signin);
  };

  const login = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      router.push(PATH_DASHBOARD.default);
      return true;
    }

    return false;
  };

  return {
    user: session?.user,
    permissions: session?.permissions || [],
    roles: session?.roles || [],
    isAuthenticated,
    isLoading,
    login,
    logout,
    accessToken: session?.accessToken,
  };
};
