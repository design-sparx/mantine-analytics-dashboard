import { type ApiResponse, type components, useApiGet } from './api-utils';

// Note: Using any since TrafficDto doesn't exist in api.d.ts yet
// Replace with proper type when available in OpenAPI schema
type TrafficData = any;

// Endpoints
const ENDPOINTS = {
  list: '/api/v1/mantine/traffic',
} as const;

// Hooks
export function useTraffic(options?: {
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}) {
  const { startDate, endDate, enabled = true } = options || {};

  return useApiGet<TrafficData[]>(ENDPOINTS.list, {
    params: { StartDate: startDate, EndDate: endDate },
    enabled,
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Dashboard.Traffic',
  });
}
