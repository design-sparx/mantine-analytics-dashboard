import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  __clearPendingWriteRequestsForTest,
  useApiWrite,
} from '@/lib/hooks/useApiWrite';

const envelope = <T,>(data: T, status = 200) => ({
  succeeded: true,
  data,
  errors: [],
  message: 'ok',
  timestamp: new Date().toISOString(),
});

describe('useApiWrite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    __clearPendingWriteRequestsForTest();
  });

  it('sends a POST and returns the typed payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(envelope({ id: '1', title: 'New' })), {
        status: 201,
      }),
    );

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useApiWrite<any>('POST', '/api/tasks', {
        body: { title: 'New' },
        autoExecute: true,
      }),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith('/api/tasks', expect.anything());
    expect(result.current.data).toEqual({ id: '1', title: 'New' });
    expect(result.current.error).toBeNull();
  });

  it('surfaces a non-2xx response as an error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          succeeded: false,
          data: null,
          errors: ['not found'],
          message: 'Not found',
          timestamp: new Date().toISOString(),
        }),
        { status: 404 },
      ),
    );

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useApiWrite<any>('DELETE', '/api/tasks/1', { autoExecute: true }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe('Not found');
  });

  it('calls onSuccess after a successful write', async () => {
    const onSuccess = vi.fn();
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(envelope({ id: '1' }))));

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useApiWrite<any>('PUT', '/api/tasks/1', {
        body: { title: 'X' },
        onSuccess,
        autoExecute: true,
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  // New tests for hardening

  it('does not auto-execute on mount by default', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(envelope({ id: '1' }))));
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useApiWrite<any>('POST', '/api/tasks', { body: { title: 'Test' } }),
    );

    // Should not have executed yet
    expect(result.current.loading).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();

    // Manual refetch should work
    await result.current.refetch();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('auto-executes when autoExecute is true', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(envelope({ id: '1' }))));
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useApiWrite<any>('POST', '/api/tasks', {
        body: { title: 'Test' },
        autoExecute: true,
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('aborts in-flight request on unmount', async () => {
    let abortSignal: AbortSignal | null = null;
    const fetchMock = vi
      .fn()
      .mockImplementation(async (url: string, init?: RequestInit) => {
        abortSignal = init?.signal as AbortSignal;
        await new Promise((resolve) => setTimeout(resolve, 100));
        return new Response(JSON.stringify(envelope({ id: '1' })));
      });
    vi.stubGlobal('fetch', fetchMock);

    const { result, unmount } = renderHook(() =>
      useApiWrite<any>('POST', '/api/tasks', {
        body: { title: 'Test' },
        autoExecute: true,
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(true));

    unmount();

    await waitFor(() => {
      expect(abortSignal?.aborted).toBe(true);
    });
  });

  it('deduplicates concurrent write requests for same method+endpoint', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(envelope({ id: '1' }))));
    vi.stubGlobal('fetch', fetchMock);

    // Render two hooks with same method+endpoint
    const { result: result1 } = renderHook(() =>
      useApiWrite<any>('POST', '/api/tasks', {
        body: { title: 'Test 1' },
        autoExecute: true,
      }),
    );
    const { result: result2 } = renderHook(() =>
      useApiWrite<any>('POST', '/api/tasks', {
        body: { title: 'Test 2' },
        autoExecute: true,
      }),
    );

    await waitFor(() => {
      expect(result1.current.loading).toBe(false);
      expect(result2.current.loading).toBe(false);
    });

    // Should only have made ONE fetch call (deduplicated)
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('ignores superseded responses when refetch is called rapidly', async () => {
    let slowRelease: (value: unknown) => void = () => {};
    const slowGate = new Promise((resolve) => {
      slowRelease = resolve;
    });

    const fetchMock = vi
      .fn()
      .mockImplementationOnce(async () => {
        await slowGate;
        return new Response(JSON.stringify(envelope({ id: 'slow' })));
      })
      .mockResolvedValueOnce(
        new Response(JSON.stringify(envelope({ id: 'fast' }))),
      );

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useApiWrite<any>('POST', '/api/tasks', { body: { title: 'Test' } }),
    );

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
    expect(result.current.data).toEqual({ id: 'fast' });

    // Release the slow gate
    slowRelease(undefined);

    // Data should still be from fast response (superseded ignored)
    expect(result.current.data).toEqual({ id: 'fast' });
  });
});
