import { type ApiResponse, type components, useApiGet } from './api-utils';

// Note: Using any since StatsDto doesn't exist in api.d.ts yet
// Replace with proper type when available in OpenAPI schema
type StatsData = any;

// Endpoints
const ENDPOINTS = {
  list: '/api/v1/mantine/stats',
  all: '/api/v1/mantine/stats/all',
  byId: (id: string) => `/api/v1/mantine/stats/${id}`,
} as const;

// Hooks
export function useStats(options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<StatsData[]>(ENDPOINTS.list, {
    enabled,
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Dashboard.Stats',
  });
}

export function useAllStats(options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<StatsData>(ENDPOINTS.all, {
    enabled,
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Dashboard.Stats',
  });
}

export function useStatById(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<StatsData>(ENDPOINTS.byId(id), {
    enabled: enabled && !!id,
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Dashboard.Stats',
  });
}
