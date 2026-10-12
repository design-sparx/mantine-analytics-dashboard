import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { describe, expect, it } from 'vitest';

import {
  ApiRequestError,
  __clearPendingRequestsForTest,
  useApiGet,
} from '@/lib/hooks/useApiGet';

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
  beforeEach(() => {
    vi.restoreAllMocks();
    __clearPendingRequestsForTest();
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

  // New tests for hardening

  it('aborts in-flight request on unmount', async () => {
    let abortSignal: AbortSignal | null = null;
    const fetchMock = vi
      .fn()
      .mockImplementation(async (url: string, init?: RequestInit) => {
        abortSignal = init?.signal as AbortSignal;
        await new Promise((resolve) => setTimeout(resolve, 100));
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => envelope({ data: [{ id: 1 }] }),
        };
      });
    vi.stubGlobal('fetch', fetchMock);

    const { result, unmount } = renderHook(() =>
      useApiGet<{ id: number }[]>('/api/x'),
    );

    // Wait for request to start
    await waitFor(() => expect(result.current.loading).toBe(true));

    // Unmount before request completes
    unmount();

    // Wait for abort to be called
    await waitFor(() => {
      expect(abortSignal?.aborted).toBe(true);
    });
  });

  it('deduplicates concurrent requests for the same endpoint', async () => {
    let resolveFetch: (value: Response) => void;
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    const fetchMock = vi.fn().mockReturnValue(fetchPromise);
    vi.stubGlobal('fetch', fetchMock);

    // Render two hooks with same endpoint
    const { result: result1 } = renderHook(() =>
      useApiGet<{ id: number }[]>('/api/x'),
    );
    const { result: result2 } = renderHook(() =>
      useApiGet<{ id: number }[]>('/api/x'),
    );

    // Resolve the fetch with a successful response
    resolveFetch!(
      new Response(JSON.stringify(envelope({ data: [{ id: 1 }] })), {
        status: 200,
        statusText: 'OK',
      }),
    );

    await waitFor(() => {
      expect(result1.current.loading).toBe(false);
      expect(result2.current.loading).toBe(false);
    });

    // Should only have made ONE fetch call (deduplicated)
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('ignores superseded responses when refetch is called', async () => {
    let slowRelease: (value: unknown) => void = () => {};
    const slowGate = new Promise((resolve) => {
      slowRelease = resolve;
    });

    let initialResolve: (value: Response) => void;
    const initialPromise = new Promise<Response>((resolve) => {
      initialResolve = resolve;
    });

    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => initialPromise)
      .mockImplementationOnce(async () => {
        await slowGate;
        return new Response(
          JSON.stringify(envelope({ data: [{ id: 'slow' }] })),
          {
            status: 200,
            statusText: 'OK',
          },
        );
      })
      .mockResolvedValueOnce(
        new Response(JSON.stringify(envelope({ data: [{ id: 'fast' }] })), {
          status: 200,
          statusText: 'OK',
        }),
      );

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useApiGet<{ id: string }[]>('/api/x'));

    // Resolve initial fetch
    initialResolve!(
      new Response(JSON.stringify(envelope({ data: [{ id: 'initial' }] })), {
        status: 200,
        statusText: 'OK',
      }),
    );

    // Wait for initial fetch to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // First request starts (slow)
    await result.current.refetch();
    await waitFor(() => expect(result.current.loading).toBe(true));

    // Immediately refetch again (should supersede first)
    await result.current.refetch();

    // Wait for second request to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Data should be from the fast response
    expect(result.current.data).toEqual([{ id: 'fast' }]);

    // Release the slow gate
    slowRelease(undefined);

    // Data should still be from fast response (superseded ignored)
    expect(result.current.data).toEqual([{ id: 'fast' }]);
  });

  // Tests for the dedup data-sharing bug

  it('gives every consumer of the same endpoint the data from a single request', async () => {
    const fetchMock = mockResponse(envelope({ data: [{ id: 1 }] }));

    const { result } = renderHook(() => ({
      a: useApiGet<{ id: number }[]>('/api/x'),
      b: useApiGet<{ id: number }[]>('/api/x'),
    }));

    await waitFor(() => expect(result.current.a.loading).toBe(false));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.a.data).toEqual([{ id: 1 }]);
    expect(result.current.b.data).toEqual([{ id: 1 }]);
  });

  it('gives every consumer the error from a single failed request', async () => {
    const fetchMock = mockResponse(
      envelope({ succeeded: false, message: 'boom' }),
      500,
    );

    const { result } = renderHook(() => ({
      a: useApiGet<{ id: number }[]>('/api/x'),
      b: useApiGet<{ id: number }[]>('/api/x'),
    }));

    await waitFor(() => expect(result.current.a.loading).toBe(false));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.a.error).toBeInstanceOf(ApiRequestError);
    expect(result.current.a.error?.message).toBe('boom');
    expect(result.current.b.error).toBeInstanceOf(ApiRequestError);
    expect(result.current.b.error?.message).toBe('boom');
  });

  it('keeps a shared request alive when one consumer unmounts', async () => {
    let release: (value: unknown) => void = () => {};
    const gate = new Promise((resolve) => {
      release = resolve;
    });

    const fetchMock = vi.fn().mockImplementation(async () => {
      await gate;
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => envelope({ data: [{ id: 7 }] }),
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    const first = renderHook(() => useApiGet<{ id: number }[]>('/api/x'));
    const second = renderHook(() => useApiGet<{ id: number }[]>('/api/x'));

    // Wait for the first hook to start the request
    await waitFor(() => expect(first.result.current.loading).toBe(true));

    // Unmount the first consumer while the request is pending
    first.unmount();

    // Release the gate — the shared request should still complete
    release(undefined);

    await waitFor(() => expect(second.result.current.loading).toBe(false));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(second.result.current.data).toEqual([{ id: 7 }]);
  });
});
