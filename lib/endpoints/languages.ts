import { type ApiResponse, type components, useApiGet } from './api-utils';

// Note: Using any since LanguageDto doesn't exist in api.d.ts schema
// Replace with proper type when available in OpenAPI schema
type LanguageData = any;

// Endpoints
const ENDPOINTS = {
  list: '/api/v1/languages',
  byCode: (code: string) => `/api/v1/languages/${code}`,
} as const;

// Hooks
export function useLanguages(options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<LanguageData[]>(ENDPOINTS.list, {
    enabled,
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Dashboard.Languages',
  });
}

export function useLanguage(code: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<LanguageData>(ENDPOINTS.byCode(code), {
    enabled: enabled && !!code,
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Dashboard.Languages',
  });
}
