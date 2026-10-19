import { MantineProvider } from '@mantine/core';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RealEstateDashboard } from '@/app/dashboard/real-estate/RealEstateDashboard';
import { __clearPendingRequestsForTest } from '@/lib/hooks/useApiGet';
import { API_REAL_ESTATE } from '@/routes/api';

/**
 * Note: we intentionally do NOT wrap in React.StrictMode.
 * StrictMode double-mounts effects and aborts the first request, which
 * would double the fetch count in dev. The dedup unit tests already
 * cover the double-mount path via the abort controller.
 */
const envelope = {
  succeeded: true,
  data: [],
  errors: [],
  message: 'ok',
  timestamp: '2026-10-04T00:00:00.000Z',
};

const makeFetchMock = (resolveImmediately = true) => {
  let release: (value: unknown) => void = () => {};
  const gate = new Promise((resolve) => {
    release = resolve;
  });

  const fetchMock = vi.fn(async (url: string) => {
    if (!resolveImmediately) {
      await gate;
    }
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ ...envelope }),
    };
  });

  return { fetchMock, release };
};

describe('RealEstateDashboard request count', () => {
  beforeEach(() => {
    __clearPendingRequestsForTest();
  });

  it('issues exactly one request per endpoint', async () => {
    const { fetchMock } = makeFetchMock();
    vi.stubGlobal('fetch', fetchMock);

    render(
      <MantineProvider>
        <RealEstateDashboard />
      </MantineProvider>,
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(6));

    expect(fetchMock).toHaveBeenCalledTimes(6);

    const requestedUrls = fetchMock.mock.calls.map((call) => String(call[0]));
    const expectedUrls = Object.values(API_REAL_ESTATE);
    expect(new Set(requestedUrls)).toEqual(new Set(expectedUrls));
    expect(requestedUrls).toHaveLength(6);
  });

  it('fires every request before any response resolves', async () => {
    let callCount = 0;
    const fetchMock = vi.fn(async () => {
      callCount += 1;
      // Never resolves until released — proves all 6 fire in parallel
      await new Promise(() => {});
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <MantineProvider>
        <RealEstateDashboard />
      </MantineProvider>,
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(6));

    expect(callCount).toBe(6);
  });

  it('does not refetch on re-render', async () => {
    const { fetchMock } = makeFetchMock();
    vi.stubGlobal('fetch', fetchMock);

    const { rerender } = render(
      <MantineProvider>
        <RealEstateDashboard />
      </MantineProvider>,
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(6));

    rerender(
      <MantineProvider>
        <RealEstateDashboard />
      </MantineProvider>,
    );

    expect(fetchMock).toHaveBeenCalledTimes(6);
  });

  it('keeps other sections when one endpoint returns 500', async () => {
    const errorEnvelope = {
      succeeded: false,
      data: null,
      errors: [],
      message: 'Internal Server Error',
      timestamp: new Date().toISOString(),
    };

    const fetchMock = vi.fn(async (url: string) => {
      if (String(url) === API_REAL_ESTATE.salesTrends) {
        return {
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({ ...errorEnvelope }),
        };
      }
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ ...envelope }),
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <MantineProvider>
        <RealEstateDashboard />
      </MantineProvider>,
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(6));

    // The failing section shows its error alert
    expect(
      screen.getByText('Error loading sales trends'),
    ).toBeInTheDocument();

    // Sibling sections are unaffected — their headers are still visible
    expect(screen.getByText('Top Locations')).toBeInTheDocument();
    expect(screen.getByText('Price Distribution')).toBeInTheDocument();
    expect(screen.getByText('Property Listings')).toBeInTheDocument();
  });
});
