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
type Settled<T> =
  | { kind: 'data'; data: T }
  | { kind: 'error'; error: Error }
  | { kind: 'aborted' };

const request = async (
  endpoint: string,
  signal: AbortSignal,
): Promise<Settled<unknown>> => {
  try {
    const response = await fetch(endpoint, {
      headers: { 'Content-Type': 'application/json' },
      signal,
    });
    const body = await parseBody(response);

    if (!response.ok || !body.succeeded) {
      const message =
        body.message || `Request failed with status ${response.status}`;
      return {
        kind: 'error',
        error: new ApiRequestError(message, response.status, body),
      };
    }

    return { kind: 'data', data: body.data };
  } catch (caught) {
    if (caught instanceof DOMException && caught.name === 'AbortError') {
      return { kind: 'aborted' };
    }
    return {
      kind: 'error',
      error:
        caught instanceof Error
          ? caught
          : new Error('Something went wrong. Please try again.'),
    };
  }
};

const pendingRequests = new Map<
  string,
  {
    abortController: AbortController;
    promise: Promise<Settled<unknown>>;
    owners: Set<symbol>;
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

  const hookInstanceIdRef = useRef(Symbol('hookInstance'));
  // Generation counter to ignore stale responses
  const generationRef = useRef(0);
  // Ref to latest fetchData so the aborted-retry path can call it
  const fetchDataRef = useRef<(() => void) | null>(null);

  const applySettled = useCallback(
    (settled: Settled<unknown>, currentGeneration: number) => {
      if (generationRef.current !== currentGeneration) return;

      switch (settled.kind) {
        case 'data':
          setData(settled.data as T);
          setError(null);
          setLoading(false);
          break;
        case 'error':
          setData(null);
          setError(settled.error);
          setLoading(false);
          break;
        case 'aborted':
          fetchDataRef.current?.();
          break;
      }
    },
    [],
  );

  const fetchData = useCallback(() => {
    const currentGeneration = ++generationRef.current;
    const instanceId = hookInstanceIdRef.current;

    const existing = pendingRequests.get(endpoint);
    if (existing) {
      existing.owners.add(instanceId);
      void existing.promise.then((settled) =>
        applySettled(settled, currentGeneration),
      );
      return;
    }

    setLoading(true);
    setError(null);

    const abortController = new AbortController();
    const promise = request(endpoint, abortController.signal);
    const entry = {
      abortController,
      promise,
      owners: new Set<symbol>([instanceId]),
    };
    pendingRequests.set(endpoint, entry);

    void promise
      .then((settled) => applySettled(settled, currentGeneration))
      .finally(() => {
        if (pendingRequests.get(endpoint) === entry) {
          pendingRequests.delete(endpoint);
        }
      });
  }, [endpoint, applySettled]);

  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  const refetch = useCallback(async (): Promise<void> => {
    const existing = pendingRequests.get(endpoint);
    if (existing) {
      existing.abortController.abort();
      pendingRequests.delete(endpoint);
    }
    fetchData();
  }, [endpoint, fetchData]);

  useEffect(() => {
    const instanceId = hookInstanceIdRef.current;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchData is the request starter, not an arbitrary setState
    fetchData();

    return () => {
      const pending = pendingRequests.get(endpoint);
      if (pending) {
        pending.owners.delete(instanceId);
        if (pending.owners.size === 0) {
          pending.abortController.abort();
        }
      }
      generationRef.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  return { data, loading, error, refetch };
}
