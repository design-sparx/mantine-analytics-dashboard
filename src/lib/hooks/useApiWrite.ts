'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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
  refetch: () => Promise<void>;
}

export function useApiWrite<T>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  options: { body?: unknown; onSuccess?: () => void } = {},
): ApiWriteResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiWriteError | null>(null);
  const active = useRef(true);
  const bodyRef = useRef(options.body);
  const onSuccessRef = useRef(options.onSuccess);

  bodyRef.current = options.body;
  onSuccessRef.current = options.onSuccess;

  const execute = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:
          bodyRef.current !== undefined
            ? JSON.stringify(bodyRef.current)
            : undefined,
      });

      const payload = (await response.json().catch(() => ({
        succeeded: false,
        data: null,
        errors: [],
        message: response.statusText || 'Request failed',
        timestamp: new Date().toISOString(),
      }))) as IApiResponse<unknown>;

      if (!active.current) {
        return;
      }

      if (!response.ok || !payload.succeeded) {
        const message =
          payload.message || `Request failed with status ${response.status}`;
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
      if (!active.current) {
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
      if (active.current) {
        setLoading(false);
      }
    }
  }, [method, endpoint]);

  useEffect(() => {
    active.current = true;
    execute();

    return () => {
      active.current = false;
    };
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
