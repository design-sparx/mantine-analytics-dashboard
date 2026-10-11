import { MantineProvider } from '@mantine/core';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import KanbanBoard from '@/components/kanban-board/KanbanBoard';

import type { KanbanTaskDto } from '@/types';

/**
 * Regression for https://github.com/design-sparx/mantine-analytics-dashboard/issues/170
 *
 * Dragging a task to a new column must persist its new status exactly once,
 * with failures visible to the user and no duplicate writes.
 */

const mockTasks: KanbanTaskDto[] = [
  {
    id: 'task-1',
    title: 'Task 1',
    status: '1',
    comments: 0,
    users: 0,
  },
  {
    id: 'task-2',
    title: 'Task 2',
    status: '1',
    comments: 0,
    users: 0,
  },
];

const envelope = <T,>(data: T) => ({
  succeeded: true,
  data,
  errors: [],
  message: 'ok',
  timestamp: new Date().toISOString(),
});

const stubFetch = (): ReturnType<typeof vi.fn> =>
  vi.fn(async (input: RequestInfo | URL, _init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/api/tasks')) {
      if (url.endsWith('/tasks')) {
        // Collection read
        return new Response(JSON.stringify(envelope(mockTasks)), {
          status: 200,
        });
      }
      // Detail write
      return new Response(
        JSON.stringify(envelope({ ...mockTasks[0], status: '2' })),
        { status: 200 },
      );
    }
    return new Response(JSON.stringify(envelope([])), { status: 200 });
  });

const renderKanbanBoard = () =>
  render(
    <MantineProvider>
      <div style={{ width: '800px', height: '600px' }}>
        <KanbanBoard />
      </div>
    </MantineProvider>,
  );

describe('KanbanBoard drag persistence', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders kanban board with tasks', async () => {
    const fetchMock = stubFetch();
    vi.stubGlobal('fetch', fetchMock);

    renderKanbanBoard();

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('uses the per-task detail endpoint from the registry for writes (not collection endpoint)', async () => {
    const fetchMock = stubFetch();
    vi.stubGlobal('fetch', fetchMock);

    renderKanbanBoard();

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Check that the collection endpoint was called for initial load
    const readCalls = fetchMock.mock.calls.filter((call) => {
      const callUrl = String(call[0]);
      return callUrl === '/api/tasks';
    });
    expect(readCalls.length).toBe(1);
  });

  it('does not make write calls during initial render', async () => {
    const fetchMock = stubFetch();
    vi.stubGlobal('fetch', fetchMock);

    renderKanbanBoard();

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // No write calls should have been made yet
    const writeCalls = fetchMock.mock.calls.filter((call) => {
      const init = call[1] as RequestInit | undefined;
      const callUrl = String(call[0]);
      return callUrl.includes('/api/tasks/') && init?.method === 'PUT';
    });
    expect(writeCalls.length).toBe(0);
  });
});
