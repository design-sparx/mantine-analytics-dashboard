import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { describe, expect, it } from 'vitest';

import { ApiRequestError, useApiGet } from '@/lib/hooks/useApiGet';

import type { IApiResponse } from '@/types/api-response';

type Envelope<T> = IApiResponse<T>;

const envelope = <T,>(overrides: Partial<Envelope<T>> = {}): Envelope<T> => ({
  succeeded: true,
  data: null,
  errors: [],
  message: 'ok',
  timestamp: '2026-10-04T00:00:00.000Z',
  ...overrides,
});

/** Mocks fetch with a JSON body and a given HTTP status. */
const mockResponse = <T,>(body: Envelope<T>, status = 200) => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: 'Internal Server Error',
    json: async () => body,
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

describe('useApiGet', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports loading before the response resolves', async () => {
    let release: (value: unknown) => void = () => {};
    const gate = new Promise((resolve) => {
      release = resolve;
    });

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        await gate;
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => envelope({ data: [{ id: 1 }] }),
        };
      }),
    );

    const { result } = renderHook(() => useApiGet<{ id: number }[]>('/api/x'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    release(undefined);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('unwraps the payload so call sites do not read data.data', async () => {
    mockResponse(envelope({ data: [{ id: 'a' }, { id: 'b' }] }));

    const { result } = renderHook(() => useApiGet<{ id: string }[]>('/api/x'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual([{ id: 'a' }, { id: 'b' }]);
  });

  it('treats succeeded: false on a 200 as an error, not as empty data', async () => {
    mockResponse(
      envelope({
        succeeded: false,
        data: null,
        message: 'Failed to fetch widgets',
        errors: ['Failed to fetch widgets'],
      }),
      200,
    );

    const { result } = renderHook(() => useApiGet('/api/x'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(ApiRequestError);
    expect(result.current.error?.message).toBe('Failed to fetch widgets');
    expect(result.current.data).toBeNull();
  });

  it('reports an error on a 500 and keeps the message the route sent', async () => {
    mockResponse(
      envelope({
        succeeded: false,
        data: null,
        message: 'Failed to fetch invoices',
        errors: ['Failed to fetch invoices'],
      }),
      500,
    );

    const { result } = renderHook(() => useApiGet('/api/x'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const error = result.current.error as ApiRequestError;

    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error.status).toBe(500);
    expect(error.message).toBe('Failed to fetch invoices');
    expect(error.serverErrors).toEqual(['Failed to fetch invoices']);
    expect(result.current.data).toBeNull();
  });

  it('falls back to the status text when a 500 body is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 502,
        statusText: 'Bad Gateway',
        json: async () => {
          throw new SyntaxError('Unexpected token < in JSON');
        },
      })),
    );

    const { result } = renderHook(() => useApiGet('/api/x'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toBeNull();
  });

  it('surfaces a network failure as an error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch');
      }),
    );

    const { result } = renderHook(() => useApiGet('/api/x'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(TypeError);
    expect(result.current.data).toBeNull();
  });

  it('clears a previous error when refetched', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () =>
          envelope({ succeeded: false, message: 'Failed', errors: ['Failed'] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => envelope({ data: [{ id: 1 }] }),
      });

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useApiGet<{ id: number }[]>('/api/x'));

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error);
    });

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });

    expect(result.current.data).toEqual([{ id: 1 }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
