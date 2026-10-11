'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { IApiResponse } from '@/types/api-response';

/**
 * Result of a standard GET request.
 *
 * `data` is already unwrapped from the response envelope, so a call site reads
 * `data` rather than `data.data`. It is `null` until the request succeeds, so
 * components can use it directly without a nested optional chain.
 */
export interface IApiGetResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  /** Re-issues the request. */
  refetch: () => Promise<void>;
}

/**
 * Raised when a route returns `succeeded: false`, whether or not the status was
 * an error code. A 200 with a failure envelope is still a failure, and callers
 * should not have to inspect the status to notice.
 */
export class ApiRequestError extends Error {
  /** Message reported by the route, when it sent one. */
  readonly serverMessage?: string;

  /** Per-item messages reported by the route. */
  readonly serverErrors: string[];

  readonly status: number;

  constructor(message: string, status: number, body?: IApiResponse<unknown>) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.serverMessage = body?.message;
    this.serverErrors = body?.errors ?? [];
  }
}

const parseBody = async (
  response: Response,
): Promise<IApiResponse<unknown>> => {
  try {
    return (await response.json()) as IApiResponse<unknown>;
  } catch {
    // A route that answered with a non-JSON body still needs to produce an
    // error, just not a crash.
    return {
      succeeded: false,
      data: null,
      errors: [],
      message: response.statusText || 'Request failed',
      timestamp: new Date().toISOString(),
    };
  }
};

// Module-level request deduplication state
const pendingRequests = new Map<
  string,
  {
    abortController: AbortController;
    promise: Promise<void>;
    hookInstanceId: symbol;
  }
>();

/** Test-only helper to clear pending requests between tests. */
export function __clearPendingRequestsForTest(): void {
  pendingRequests.forEach(({ abortController }) => {
    abortController.abort();
  });
  pendingRequests.clear();
}

/**
 * The one way a component should read from a mock endpoint.
 *
 * Unlike Mantine's `useFetch`, this keeps the response body when the status is
 * an error, so a 500 that explains itself in `message` and `errors` reports that
 * explanation instead of a bare status code. It also treats `succeeded: false`
 * on a 200 as the error it is, rather than handing back an empty payload.
 *
 * @param endpoint A path from the registry in `src/routes/api.ts`.
 */
export function useApiGet<T>(endpoint: string): IApiGetResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Unique ID for this hook instance (for deduplication vs superseding)
  const hookInstanceIdRef = useRef(Symbol('hookInstance'));
  // Generation counter to ignore stale responses
  const generationRef = useRef(0);

  const fetchData = useCallback(async (): Promise<void> => {
    // Increment generation for this new request
    const currentGeneration = ++generationRef.current;

    // Check for existing pending request for this endpoint
    const existing = pendingRequests.get(endpoint);
    if (existing) {
      // If same hook instance, supersede (abort previous)
      // If different hook instance, deduplicate (wait for existing)
      if (existing.hookInstanceId === hookInstanceIdRef.current) {
        existing.abortController.abort();
        pendingRequests.delete(endpoint);
      } else {
        // Different hook instance - deduplicate by waiting
        try {
          await existing.promise;
        } catch {
          // Ignore errors from the awaited request
        }
        // After waiting, if we're still the current generation, the state was already updated
        if (generationRef.current === currentGeneration) {
          setLoading(false);
          return;
        }
        // If generation changed (unlikely for different hook), fall through to make new request
      }
    }

    // Create new AbortController for this request
    const abortController = new AbortController();

    const promise = (async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(endpoint, {
          headers: { 'Content-Type': 'application/json' },
          signal: abortController.signal,
        });
        const body = await parseBody(response);

        // Check if this request has been superseded
        if (generationRef.current !== currentGeneration) {
          return;
        }

        if (!response.ok || !body.succeeded) {
          const message =
            body.message || `Request failed with status ${response.status}`;

          setData(null);
          setError(new ApiRequestError(message, response.status, body));
          return;
        }

        setData(body.data as T);
      } catch (caught) {
        // Ignore abort errors
        if (caught instanceof DOMException && caught.name === 'AbortError') {
          return;
        }
        if (generationRef.current !== currentGeneration) {
          return;
        }

        setData(null);
        setError(
          caught instanceof Error
            ? caught
            : new Error('Something went wrong. Please try again.'),
        );
      } finally {
        if (generationRef.current === currentGeneration) {
          setLoading(false);
        }
        // Clean up pending request
        pendingRequests.delete(endpoint);
      }
    })();

    // Register this request for deduplication
    pendingRequests.set(endpoint, {
      abortController,
      promise,
      hookInstanceId: hookInstanceIdRef.current,
    });
  }, [endpoint]);

  useEffect(() => {
    const promise = fetchData();

    return () => {
      // Abort in-flight request on unmount
      const pending = pendingRequests.get(endpoint);
      if (pending) {
        pending.abortController.abort();
      }
      // Also increment generation to ignore any response that comes after unmount
      // Copy ref value to avoid exhaustive-deps warning
      const currentGen = generationRef.current;
      generationRef.current = currentGen + 1;
    };
  }, [fetchData, endpoint]);

  return { data, loading, error, refetch: fetchData };
}
