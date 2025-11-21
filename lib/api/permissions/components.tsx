import React from 'react';

import { Alert, Text } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';

import {
  useHasAllPermissions,
  useHasAnyPermission,
  useHasPermission,
} from './hooks';

import type { Permission } from './types';

interface PermissionGateProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

/**
 * Component that conditionally renders children based on single permission
 */
export function PermissionGate({
  permission,
  children,
  fallback,
  showFallback = false,
}: PermissionGateProps) {
  const hasAccess = useHasPermission(permission);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (showFallback && fallback) {
    return <>{fallback}</>;
  }

  if (showFallback) {
    return (
      <Alert icon={<IconLock size={16} />} color="yellow" variant="light">
        <Text size="sm">
          You don&apos;t have permission to access this feature.
        </Text>
      </Alert>
    );
  }

  return null;
}

interface MultiPermissionGateProps {
  permissions: Permission[];
  mode?: 'any' | 'all';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

/**
 * Component that conditionally renders children based on multiple permissions
 */
export function MultiPermissionGate({
  permissions,
  mode = 'any',
  children,
  fallback,
  showFallback = false,
}: MultiPermissionGateProps) {
  const hasAnyAccess = useHasAnyPermission(permissions);
  const hasAllAccess = useHasAllPermissions(permissions);

  const hasAccess = mode === 'any' ? hasAnyAccess : hasAllAccess;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (showFallback && fallback) {
    return <>{fallback}</>;
  }

  if (showFallback) {
    return (
      <Alert icon={<IconLock size={16} />} color="yellow" variant="light">
        <Text size="sm">
          You don&apos;t have the required permissions to access this feature.
        </Text>
      </Alert>
    );
  }

  return null;
}

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

/**
 * Component that only renders for admin users
 */
export function AdminOnly({
  children,
  fallback,
  showFallback = false,
}: AdminOnlyProps) {
  return (
    <MultiPermissionGate
      permissions={[
        'Permissions.Admin.UserManagement',
        'Permissions.Admin.SystemSettings',
      ]}
      mode="any"
      fallback={fallback}
      showFallback={showFallback}
    >
      {children}
    </MultiPermissionGate>
  );
}

interface ConditionalRenderProps {
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Generic conditional render component
 */
export function ConditionalRender({
  condition,
  children,
  fallback,
}: ConditionalRenderProps) {
  return condition ? <>{children}</> : <>{fallback}</>;
}
