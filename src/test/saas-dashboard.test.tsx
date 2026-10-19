import { MantineProvider } from '@mantine/core';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SaasDashboard } from '@/app/dashboard/saas/SaasDashboard';
import { __clearPendingRequestsForTest } from '@/lib/hooks/useApiGet';

const envelope = (data: unknown) => ({
  succeeded: true,
  data,
  errors: [],
  message: 'ok',
  timestamp: '2026-10-16T00:00:00.000Z',
});

const statsEnvelope = {
  data: [{ title: 'Sales Today', value: '13,456', diff: 34, period: 'today' }],
};

const projectRows = [{ id: 'p1', name: 'Alpha', status: 'Active' }];

describe('SaasDashboard', () => {
  beforeEach(() => {
    __clearPendingRequestsForTest();
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () =>
          envelope(url.includes('/stats') ? statsEnvelope : projectRows),
      })),
    );
  });

  it('renders stat cards from the wrapped /api/stats payload', async () => {
    render(
      <MantineProvider>
        <SaasDashboard />
      </MantineProvider>,
    );

    expect(await screen.findByText('Sales Today')).toBeInTheDocument();
  });
});
