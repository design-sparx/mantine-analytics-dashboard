import { MantineProvider } from '@mantine/core';
import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock localStorage directly on window object - use a mutable storage object
const storage: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => storage[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    storage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete storage[key];
  }),
  clear: vi.fn(() => {
    Object.keys(storage).forEach((k) => delete storage[k]);
  }),
  get length() {
    return Object.keys(storage).length;
  },
  key: vi.fn((index: number) => Object.keys(storage)[index] ?? null),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Now import the provider (after localStorage is mocked)
import {
  SystemNotificationsProvider,
  useSystemNotifications,
} from '@/contexts/system-notifications/SystemNotificationsContext';

/**
 * Regression for https://github.com/design-sparx/mantine-analytics-dashboard/issues/169
 */

const mockAnnouncements = [
  { id: 'ann-1', title: 'Announcement 1', message: 'Test message 1' },
];

function TestComponent() {
  const { notifications, dismissedIds } = useSystemNotifications();
  return (
    <div>
      <div data-testid="notifications-count">{notifications.length}</div>
      <div data-testid="dismissed-ids">{JSON.stringify(dismissedIds)}</div>
    </div>
  );
}

const renderProvider = (
  {
    initialStorage = {},
    announcementsUrl = '/system-announcements.json',
    fetchMock,
  } = {} as {
    initialStorage?: Record<string, string>;
    announcementsUrl?: string;
    fetchMock?: ReturnType<typeof vi.fn>;
  },
) => {
  // Clear and set initial storage as JSON STRINGS before rendering
  Object.keys(storage).forEach((k) => delete storage[k]);
  Object.assign(storage, initialStorage);

  if (fetchMock) {
    vi.stubGlobal('fetch', fetchMock);
  }

  const renderResult = render(
    <MantineProvider>
      <SystemNotificationsProvider announcementsUrl={announcementsUrl}>
        <TestComponent />
      </SystemNotificationsProvider>
    </MantineProvider>,
  );

  return { container: renderResult.container, unmount: renderResult.unmount };
};

describe('SystemNotificationsProvider announcement retry logic', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    // Clear storage
    Object.keys(storage).forEach((k) => delete storage[k]);
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches announcements and clears dismissals at most once when all are dismissed (no infinite loop)', async () => {
    // Pre-populate localStorage with all announcement IDs dismissed (as JSON string)
    const dismissedIds = mockAnnouncements.map((a) => a.id);
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify(mockAnnouncements), { status: 200 });
    });

    const { container } = renderProvider({
      initialStorage: {
        'system-notifications': JSON.stringify({
          dismissedIds,
          notifications: [],
        }),
      },
      fetchMock,
    });

    // Wait for first fetch
    await waitFor(
      () => {
        expect(fetchMock).toHaveBeenCalledTimes(1);
      },
      { timeout: 5000 },
    );

    // Wait for retry (50ms setTimeout + second fetch)
    await waitFor(
      () => {
        expect(fetchMock).toHaveBeenCalledTimes(2);
      },
      { timeout: 3000 },
    );

    // The fetch should happen at most 2 times (initial + one retry)
    // The bug caused infinite recursion; fix bounds it to max 2
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // After retry, the latest announcement should be surfaced
    const countEl = container.querySelector(
      '[data-testid="notifications-count"]',
    );
    expect(countEl?.textContent).toBe('1');
  });

  it('does not clear dismissals when some announcements are new', async () => {
    // Pre-populate with only one dismissed ID, but fetch returns two announcements
    const newAnnouncements = [
      { id: 'ann-1', title: 'Old', message: 'Test' },
      { id: 'ann-2', title: 'New', message: 'Test' },
    ];
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify(newAnnouncements), { status: 200 });
    });

    const dismissedIds = ['ann-1'];
    const { container } = renderProvider({
      initialStorage: {
        'system-notifications': JSON.stringify({
          dismissedIds,
          notifications: [],
        }),
      },
      fetchMock,
    });

    // Wait for the effect to complete
    await waitFor(
      () => {
        expect(fetchMock).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );

    // Should only fetch once (no retry needed because ann-2 is new)
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Should NOT clear dismissals because ann-2 is new
    const dismissedEl = container.querySelector(
      '[data-testid="dismissed-ids"]',
    );
    expect(dismissedEl?.textContent).toContain('ann-1');

    // Should surface the new announcement (ann-2 is not dismissed)
    const countEl = container.querySelector(
      '[data-testid="notifications-count"]',
    );
    expect(countEl?.textContent).toBe('1');
  });

  it('does not update state after unmount', async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify(mockAnnouncements), { status: 200 });
    });

    const { unmount } = renderProvider({ fetchMock });

    // Unmount before fetch completes
    unmount();

    // Wait a bit for any pending async work
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Should not throw or cause state updates on unmounted component
    // The fetch may have started before unmount, but no state update should occur
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
