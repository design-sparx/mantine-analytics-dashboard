import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useLlmStats } from '@/lib/api/endpointHooks';

const envelope = <T,>(data: T) => ({
  succeeded: true,
  data,
  errors: [],
  message: 'ok',
  timestamp: '2026-10-04T00:00:00.000Z',
});

describe('generated endpoint hooks', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('a generated hook fetches its registry path and unwraps the payload', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => envelope([{ title: 'Requests', value: '1.2M' }]),
    }));

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useLlmStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/llm/stats',
      expect.objectContaining({ headers: expect.any(Object) }),
    );
    expect(result.current.data).toEqual([{ title: 'Requests', value: '1.2M' }]);
    expect(result.current.error).toBeNull();
  });
});
