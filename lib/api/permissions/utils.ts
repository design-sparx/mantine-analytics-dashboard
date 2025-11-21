import type { Permission, PermissionCheck, UserPermissions } from './types';

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  userPermissions: UserPermissions | null,
  permission: Permission,
): boolean {
  if (!userPermissions) return false;
  return userPermissions.permissions.includes(permission);
}

/**
 * Check if user has any of the provided permissions
 */
export function hasAnyPermission(
  userPermissions: UserPermissions | null,
  permissions: Permission[],
): boolean {
  if (!userPermissions) return false;
  return permissions.some((permission) =>
    userPermissions.permissions.includes(permission),
  );
}

/**
 * Check if user has all of the provided permissions
 */
export function hasAllPermissions(
  userPermissions: UserPermissions | null,
  permissions: Permission[],
): boolean {
  if (!userPermissions) return false;
  return permissions.every((permission) =>
    userPermissions.permissions.includes(permission),
  );
}

/**
 * Detailed permission check with reason
 */
export function checkPermission(
  userPermissions: UserPermissions | null,
  permission: Permission,
): PermissionCheck {
  if (!userPermissions) {
    return {
      hasPermission: false,
      reason: 'User not authenticated',
    };
  }

  const hasAccess = userPermissions.permissions.includes(permission);

  return {
    hasPermission: hasAccess,
    reason: hasAccess ? undefined : `Missing permission: ${permission}`,
  };
}

/**
 * Get user permissions from localStorage (browser only)
 */
export function getUserPermissions(): UserPermissions | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem('userPermissions');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Store user permissions to localStorage
 */
export function setUserPermissions(permissions: UserPermissions): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('userPermissions', JSON.stringify(permissions));
}

/**
 * Clear user permissions from localStorage
 */
export function clearUserPermissions(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('userPermissions');
}

/**
 * Check if user is admin
 */
export function isAdmin(userPermissions: UserPermissions | null): boolean {
  return userPermissions?.role === 'Admin';
}

/**
 * Filter items based on permissions
 */
export function filterByPermission<T>(
  items: T[],
  userPermissions: UserPermissions | null,
  getPermission: (item: T) => Permission,
): T[] {
  if (!userPermissions) return [];

  return items.filter((item) => {
    const permission = getPermission(item);
    return hasPermission(userPermissions, permission);
  });
}
