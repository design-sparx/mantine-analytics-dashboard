import { useCallback, useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import {
  checkPermission,
  getUserPermissions,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  isAdmin,
} from './utils';

import type { Permission, PermissionCheck, UserPermissions } from './types';

/**
 * Hook to get current user permissions
 * Falls back to NextAuth session if localStorage is empty
 */
export function usePermissions(): UserPermissions | null {
  const { data: session } = useSession();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);

  useEffect(() => {
    // Get initial permissions from localStorage
    const storedPermissions = getUserPermissions();

    if (storedPermissions) {
      setPermissions(storedPermissions);
    } else if (session?.permissions) {
      // Fallback to session permissions if localStorage is empty
      const sessionPermissions: UserPermissions = {
        permissions: session.permissions as Permission[],
        role: session.roles?.[0] as 'Admin' | 'User',
      };
      setPermissions(sessionPermissions);
    }

    // Listen for localStorage changes (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userPermissions') {
        setPermissions(getUserPermissions());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [session]);

  return permissions;
}

/**
 * Hook to check if user has a specific permission
 */
export function useHasPermission(permission: Permission): boolean {
  const userPermissions = usePermissions();
  return hasPermission(userPermissions, permission);
}

/**
 * Hook to check if user has any of the provided permissions
 */
export function useHasAnyPermission(permissions: Permission[]): boolean {
  const userPermissions = usePermissions();
  return hasAnyPermission(userPermissions, permissions);
}

/**
 * Hook to check if user has all of the provided permissions
 */
export function useHasAllPermissions(permissions: Permission[]): boolean {
  const userPermissions = usePermissions();
  return hasAllPermissions(userPermissions, permissions);
}

/**
 * Hook for detailed permission checking
 */
export function usePermissionCheck(permission: Permission): PermissionCheck {
  const userPermissions = usePermissions();
  return checkPermission(userPermissions, permission);
}

/**
 * Hook to check if current user is admin
 */
export function useIsAdmin(): boolean {
  const userPermissions = usePermissions();
  return isAdmin(userPermissions);
}

/**
 * Hook that provides permission checking functions
 */
export function usePermissionChecker() {
  const userPermissions = usePermissions();

  const canAccess = useCallback(
    (permission: Permission) => hasPermission(userPermissions, permission),
    [userPermissions],
  );

  const canAccessAny = useCallback(
    (permissions: Permission[]) =>
      hasAnyPermission(userPermissions, permissions),
    [userPermissions],
  );

  const canAccessAll = useCallback(
    (permissions: Permission[]) =>
      hasAllPermissions(userPermissions, permissions),
    [userPermissions],
  );

  const checkAccess = useCallback(
    (permission: Permission) => checkPermission(userPermissions, permission),
    [userPermissions],
  );

  return {
    userPermissions,
    canAccess,
    canAccessAny,
    canAccessAll,
    checkAccess,
    isAdmin: isAdmin(userPermissions),
  };
}
