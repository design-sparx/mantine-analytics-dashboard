'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import type { IApiResponse } from '@/types/api-response';

export interface ApiWriteError {
  message: string;
  serverMessage?: string;
  serverErrors: string[];
  status: number;
}

export interface ApiWriteResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiWriteError | null;
  refetch: (overrideEndpoint?: string, overrideBody?: unknown) => Promise<void>;
}

// Module-level request deduplication state for write hooks
const pendingWriteRequests = new Map<
  string,
  {
    abortController: AbortController;
    promise: Promise<void>;
    hookInstanceId: symbol;
  }
>();

/** Test-only helper to clear pending requests between tests. */
export function __clearPendingWriteRequestsForTest(): void {
  pendingWriteRequests.forEach(({ abortController }) => {
    abortController.abort();
  });
  pendingWriteRequests.clear();
}

export function useApiWrite<T>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  options: {
    body?: unknown;
    onSuccess?: () => void;
    autoExecute?: boolean;
  } = {},
): ApiWriteResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiWriteError | null>(null);
  const active = useRef(true);
  const bodyRef = useRef(options.body);
  const onSuccessRef = useRef(options.onSuccess);
  const endpointRef = useRef(endpoint);
  const generationRef = useRef(0);
  // Unique ID for this hook instance (for deduplication vs superseding)
  const hookInstanceIdRef = useRef(Symbol('hookInstance'));
  // Default autoExecute to false so write hooks don't fire on mount
  const autoExecute = options.autoExecute ?? false;

  // Update refs with latest props (safe to do in useLayoutEffect)
  useLayoutEffect(() => {
    bodyRef.current = options.body;
    onSuccessRef.current = options.onSuccess;
    endpointRef.current = endpoint;
  }, [options.body, options.onSuccess, endpoint]);

  const execute = useCallback(
    async (
      overrideEndpoint?: string,
      overrideBody?: unknown,
    ): Promise<void> => {
      // Increment generation for this new request
      const currentGeneration = ++generationRef.current;

      // Deduplication key includes method and endpoint
      const dedupKey = `${method}:${overrideEndpoint || endpointRef.current}`;

      // Check for existing pending request for same method+endpoint
      const existing = pendingWriteRequests.get(dedupKey);
      if (existing) {
        // If same hook instance, supersede (abort previous)
        // If different hook instance, deduplicate (wait for existing)
        if (existing.hookInstanceId === hookInstanceIdRef.current) {
          existing.abortController.abort();
          pendingWriteRequests.delete(dedupKey);
        } else {
          // Different hook instance - deduplicate by waiting
          try {
            await existing.promise;
          } catch {
            // Ignore
          }
          if (generationRef.current === currentGeneration) {
            return;
          }
        }
      }

      const abortController = new AbortController();

      const promise = (async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(
            overrideEndpoint || endpointRef.current,
            {
              method,
              headers: { 'Content-Type': 'application/json' },
              body:
                overrideBody !== undefined
                  ? JSON.stringify(overrideBody)
                  : bodyRef.current !== undefined
                    ? JSON.stringify(bodyRef.current)
                    : undefined,
              signal: abortController.signal,
            },
          );

          const payload = (await response.json().catch(() => ({
            succeeded: false,
            data: null,
            errors: [],
            message: response.statusText || 'Request failed',
            timestamp: new Date().toISOString(),
          }))) as IApiResponse<unknown>;

          if (!active.current || generationRef.current !== currentGeneration) {
            return;
          }

          if (!response.ok || !payload.succeeded) {
            const message =
              payload.message ||
              `Request failed with status ${response.status}`;
            setData(null);
            setError({
              message,
              serverMessage: payload.message,
              serverErrors: payload.errors ?? [],
              status: response.status,
            });
            return;
          }

          setData(payload.data as T);
          onSuccessRef.current?.();
        } catch (caught) {
          if (caught instanceof DOMException && caught.name === 'AbortError') {
            return;
          }
          if (!active.current || generationRef.current !== currentGeneration) {
            return;
          }
          setData(null);
          setError({
            message:
              caught instanceof Error ? caught.message : 'Something went wrong',
            serverMessage: undefined,
            serverErrors: [],
            status: 500,
          });
        } finally {
          if (active.current && generationRef.current === currentGeneration) {
            setLoading(false);
          }
          pendingWriteRequests.delete(dedupKey);
        }
      })();

      pendingWriteRequests.set(dedupKey, {
        abortController,
        promise,
        hookInstanceId: hookInstanceIdRef.current,
      });
    },
    [method],
  );

  useEffect(() => {
    active.current = true;
    // Only auto-execute if explicitly opted in (default false)
    if (autoExecute) {
      execute();
    }

    return () => {
      active.current = false;
      const pending = pendingWriteRequests.get(
        `${method}:${endpointRef.current}`,
      );
      if (pending) {
        pending.abortController.abort();
      }
      // Copy ref value to avoid exhaustive-deps warning
      const currentGen = generationRef.current;
      generationRef.current = currentGen + 1;
    };
  }, [execute, autoExecute, method]);

  return { data, loading, error, refetch: execute };
}
