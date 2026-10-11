'use client';

import { useApiGet } from '@/lib/hooks/useApiGet';
import { API_ENDPOINTS } from '@/routes/api';

import type { IApiGetResult } from '@/lib/hooks/useApiGet';
import type { ApiEndpointId } from '@/routes/api';
import type {
  LlmCostDto,
  LlmModelUsageDto,
  LlmPerformanceDto,
  LlmStatDto,
  LlmTokenTrendDto,
  LlmUseCaseDto,
} from '@/types/llm';

/**
 * Builds one hook per endpoint from the registry, so a new endpoint needs a
 * registry entry and nothing else.
 *
 * `payloads` supplies the response type per endpoint. Any endpoint left out is
 * typed `unknown` rather than `any`, so a call site has to narrow it before use
 * instead of silently accepting anything.
 */
function buildHooks<P extends Partial<Record<ApiEndpointId, unknown>>>(
  payloads: P,
): { [K in keyof P]: () => IApiGetResult<P[K]> } {
  const hooks = {} as { [K in keyof P]: () => IApiGetResult<P[K]> };

  (Object.keys(payloads) as (keyof P & ApiEndpointId)[]).forEach((id) => {
    const endpoint = API_ENDPOINTS[id];

    // Declared with a `use` prefix so React's rules-of-hooks can verify it,
    // rather than rejecting a closure it cannot name.

    const useEndpoint = () => useApiGet<P[typeof id]>(endpoint);

    hooks[id] = useEndpoint;
  });

  return hooks;
}

/**
 * Typed hooks for the LLM dashboard. These six are the proof that the payload
 * type survives all the way to the component: `llm/page.tsx` consumes them
 * without a cast or an `any`.
 */
const llmHooks = buildHooks({
  'llm.stats': [] as LlmStatDto[],
  'llm.modelUsage': [] as LlmModelUsageDto[],
  'llm.tokenTrends': [] as LlmTokenTrendDto[],
  'llm.useCases': [] as LlmUseCaseDto[],
  'llm.performance': [] as LlmPerformanceDto[],
  'llm.costs': [] as LlmCostDto[],
});

export const useLlmStats = llmHooks['llm.stats'];
export const useLlmModelUsage = llmHooks['llm.modelUsage'];
export const useLlmTokenTrends = llmHooks['llm.tokenTrends'];
export const useLlmUseCases = llmHooks['llm.useCases'];
export const useLlmPerformance = llmHooks['llm.performance'];
export const useLlmCosts = llmHooks['llm.costs'];
