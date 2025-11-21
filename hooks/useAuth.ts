'use client';

import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';
import {
  usePermissions,
  clearUserPermissions,
  type Permission,
} from '@/lib/api/permissions';
import type { components } from '@/lib/api';

// Type aliases for compatibility
type LoginDto = components['schemas']['LoginDto'];
type RegisterDto = components['schemas']['RegisterDto'];
type UserProfileDto = components['schemas']['UserProfileDto'];

export const useAuth = () => {
  const { data: session, status } = useSession();
  const userPermissions = usePermissions();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  // Simplified logout using NextAuth only
  const logout = async () => {
    try {
      // Clear permissions
      clearUserPermissions();

      // Call backend logout if we have a session
      if (session?.user?.email) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ email: session.user.email }),
        });
      }

      // NextAuth logout
      await signOut({ redirect: false });
      router.push(PATH_AUTH.signin);
    } catch (error) {
      console.error('Logout failed:', error);
      // Ensure cleanup happens even on error
      clearUserPermissions();
      await signOut({ redirect: false });
      router.push(PATH_AUTH.signin);
    }
  };

  // Simplified login using NextAuth only
  const login = async (email: string, password: string) => {
    try {
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
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Permission helpers - use NextAuth session permissions
  const hasPermission = (permission: Permission): boolean => {
    // Try userPermissions first, then session permissions
    const permissions =
      userPermissions?.permissions || session?.permissions || [];
    return permissions.includes(permission);
  };

  return {
    // User info from NextAuth session
    user: session?.user,

    // Permissions from RBAC system or session
    permissions: userPermissions?.permissions || session?.permissions || [],
    roles: userPermissions?.role
      ? [userPermissions.role]
      : session?.roles || [],
    userPermissions,
    hasPermission,

    // Auth state
    isAuthenticated,
    isLoading,

    // Auth actions
    login,
    logout,

    // Token access
    accessToken: session?.accessToken,
  };
};
