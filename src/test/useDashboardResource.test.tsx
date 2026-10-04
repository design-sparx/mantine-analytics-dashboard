import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useDashboardResource } from '@/lib/api/useDashboardResource';
import { API_CRM, API_ENDPOINTS, API_REAL_ESTATE } from '@/routes/api';

import type { CrmStatsDto } from '@/types/generated-fixtures';

const envelope = <T,>(data: T) => ({
  succeeded: true,
  data,
  errors: [],
  message: 'ok',
  timestamp: new Date().toISOString(),
});

describe('useDashboardResource', () => {
  it('unwraps the envelope and returns the typed payload', async () => {
    const rows: CrmStatsDto[] = [
      {
        title: 'Total Revenue',
        value: '1,204',
        diff: 12.5,
        icon: 'IconHome',
        color: 'blue',
        period: 'monthly',
      },
    ];

    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(envelope(rows))));

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useDashboardResource(API_CRM.stats as any),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith('/api/crm/stats', expect.anything());
    expect(result.current.data).toEqual(rows);
    expect(result.current.error).toBeNull();
  });

  it('surfaces a non-2xx response as an error with no data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            succeeded: false,
            data: null,
            errors: ['fixture missing'],
            message: 'Could not load CRM stats',
            timestamp: new Date().toISOString(),
          }),
          { status: 500 },
        ),
      ),
    );

    const { result } = renderHook(() =>
      useDashboardResource(API_CRM.stats as any),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe('Could not load CRM stats');
  });

  it('treats succeeded: false on a 200 as an error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            succeeded: false,
            data: null,
            errors: [],
            message: 'Partial failure',
            timestamp: new Date().toISOString(),
          }),
          { status: 200 },
        ),
      ),
    );

    const { result } = renderHook(() =>
      useDashboardResource(API_REAL_ESTATE.stats as any),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error?.message).toBe('Partial failure');
    expect(result.current.data).toBeNull();
  });

  it('refetches on demand', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(envelope([]))));

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() =>
      useDashboardResource(API_CRM.deals as any),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('every registry endpoint that the dashboard uses has a payload type', () => {
    // Guards the `TypedApiEndpoint` intersection at runtime as well: if a
    // dashboard endpoint were added to the registry without a generated DTO,
    // this would show up here even before the compiler flagged it.
    expect(API_CRM.stats).toBe('/api/crm/stats');
    expect(API_REAL_ESTATE.properties).toBe('/api/real-estate/properties');
    expect(Object.keys(API_ENDPOINTS).length).toBeGreaterThan(50);
  });
});
