'use client';

import { useApiGet } from '@/lib/hooks/useApiGet';
import { API_ENDPOINTS } from '@/routes/api';

import type { IApiGetResult } from '@/lib/hooks/useApiGet';
import type { DashboardEndpointPayloads } from '@/types/generated-fixtures';

/**
 * Every registry path that has a generated payload type.
 *
 * Intersecting with `keyof DashboardEndpointPayloads` is what makes this
 * exhaustive in both directions: a registry entry with no DTO is a compile
 * error here, and a DTO for an endpoint the registry does not have is one too.
 * Adding a path to `src/routes/api.ts` therefore cannot silently produce an
 * untyped dashboard fetch.
 */
export type TypedApiEndpoint =
  (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS] &
    keyof DashboardEndpointPayloads;

/**
 * Fetches a dashboard endpoint, typed from the fixture behind it.
 *
 * Call sites pass a registry constant (`API_CRM.stats`) rather than a string, so
 * the path is never hand-written and the payload type is inferred from the
 * constant. Requesting an endpoint whose payload type is unknown is a compile
 * error rather than an `any`.
 *
 * @example
 * const { data, loading, error } = useDashboardResource(API_CRM.stats);
 * //    ^? IApiGetResult<CrmStatsDto[]>
 */
export function useDashboardResource<Endpoint extends TypedApiEndpoint>(
  endpoint: Endpoint,
): IApiGetResult<DashboardEndpointPayloads[Endpoint]> {
  return useApiGet<DashboardEndpointPayloads[Endpoint]>(endpoint);
}
