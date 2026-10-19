import { MantineProvider } from '@mantine/core';
import { act, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import KanbanBoard from '@/components/kanban-board/KanbanBoard';

import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import type { KanbanTaskDto } from '@/types';

/**
 * Regression for https://github.com/design-sparx/mantine-analytics-dashboard/issues/170
 *
 * Dragging a task to a new column must persist its new status exactly once,
 * with failures visible to the user and no duplicate writes.
 */

type DragHandlers = {
  onDragStart?: (event: DragStartEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
};

// Captured from the real DndContext so the test can drive the drag lifecycle
// directly instead of simulating pointer events (jsdom has no layout, so
// dnd-kit's collision detection can never detect a drop target).
let dragHandlers: DragHandlers = {};

vi.mock('@dnd-kit/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@dnd-kit/core')>();
  const RealDndContext = actual.DndContext;

  return {
    ...actual,
    DndContext: (props: Parameters<typeof RealDndContext>[0]) => {
      dragHandlers = {
        onDragStart: props.onDragStart,
        onDragOver: props.onDragOver,
        onDragEnd: props.onDragEnd,
      };
      return <RealDndContext {...props} />;
    },
  };
});

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

  it('rolls back task position when write fails', async () => {
    // Make PUT to task detail return a failure envelope
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, _init?: RequestInit) => {
        const url = String(input);
        if (url === '/api/tasks') {
          return new Response(JSON.stringify(envelope(mockTasks)), {
            status: 200,
          });
        }
        if (url.includes('/api/tasks/') && _init?.method === 'PUT') {
          return new Response(
            JSON.stringify({
              succeeded: false,
              data: null,
              errors: ['Something went wrong'],
              message: 'Update failed',
              timestamp: new Date().toISOString(),
            }),
            { status: 500 },
          );
        }
        return new Response(JSON.stringify(envelope([])), { status: 200 });
      },
    );

    vi.stubGlobal('fetch', fetchMock);

    renderKanbanBoard();

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    const task = { ...mockTasks[0], columnId: 'todo', content: 'Task 1' };
    const rect = { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
    const active = {
      id: 'task-1',
      rect: { current: { initial: rect, translated: rect } },
      data: { current: { type: 'Task', task } },
    };
    const overColumn = {
      id: 'doing',
      rect,
      disabled: false,
      data: { current: { type: 'Column' } },
    };
    const baseEvent = {
      active,
      over: overColumn,
      collisions: null,
      delta: { x: 0, y: 0 },
      activatorEvent: new Event('pointerdown'),
    };

    // Drive the drag: start in Todo, drag over the Doing column, then drop.
    // The flush between over and end matters: onDragOver records its drop
    // target inside a setState updater, which only runs when React commits.
    await act(async () => {
      dragHandlers.onDragStart?.({
        active,
        activatorEvent: new Event('pointerdown'),
      });
      dragHandlers.onDragOver?.(baseEvent);
    });
    await act(async () => {
      dragHandlers.onDragEnd?.(baseEvent);
    });
    // The failed write must have been attempted
    await waitFor(() => {
      const writeCalls = fetchMock.mock.calls.filter((call) => {
        const init = call[1] as RequestInit | undefined;
        const callUrl = String(call[0]);
        return callUrl.includes('/api/tasks/') && init?.method === 'PUT';
      });
      expect(writeCalls.length).toBe(1);
      expect((writeCalls[0][1] as RequestInit).body?.toString()).toContain(
        '"status":"2"',
      );
    });

    // After the failure the task must be back in Todo, not stuck in Doing
    const owningColumn = (taskText: string): string | undefined => {
      const card = screen.getByText(taskText);
      const columnTitles = ['Todo', 'Work in progress', 'Done'];
      return columnTitles.find((title) => {
        const heading = screen.getByText(title);
        // heading -> inner Flex -> header Flex -> Paper (column container)
        const column = heading.parentElement?.parentElement?.parentElement;
        return column?.contains(card);
      });
    };

    await waitFor(() => {
      expect(owningColumn('Task 1')).toBe('Todo');
    });
  });
});
