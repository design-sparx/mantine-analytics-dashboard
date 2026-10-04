import { describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

import { useApiWrite } from '@/lib/hooks/useApiWrite';

const envelope = <T,>(data: T, status = 200) => ({
  succeeded: true,
  data,
  errors: [],
  message: 'ok',
  timestamp: new Date().toISOString(),
});

describe('useApiWrite', () => {
  it('sends a POST and returns the typed payload', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(envelope({ id: '1', title: 'New' }), 201)),
      );

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useApiWrite<any>('POST', '/api/tasks', { body: { title: 'New' } }),
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
      useApiWrite<any>('DELETE', '/api/tasks/1', {}),
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
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
