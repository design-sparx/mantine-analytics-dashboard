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

  // Guards against a slow response for a previous endpoint overwriting the
  // state of the current one.
  const active = useRef(true);

  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        headers: { 'Content-Type': 'application/json' },
      });
      const body = await parseBody(response);

      if (!active.current) {
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
      if (!active.current) {
        return;
      }

      setData(null);
      setError(
        caught instanceof Error
          ? caught
          : new Error('Something went wrong. Please try again.'),
      );
    } finally {
      if (active.current) {
        setLoading(false);
      }
    }
  }, [endpoint]);

  useEffect(() => {
    active.current = true;
    fetchData();

    return () => {
      active.current = false;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
