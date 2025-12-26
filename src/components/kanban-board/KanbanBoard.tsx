'use client';

import { useEffect, useId, useMemo, useState } from 'react';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { Box, Button, LoadingOverlay, Portal, ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconNewSection, IconPlus } from '@tabler/icons-react';

import { KanbanCard, KanbanColumn } from '@/components';
import { useFetch } from '@mantine/hooks';
import { type IApiResponse } from '@/types/api-response';
import type { KanbanTaskDto } from '@/types';

import { NewTaskModal } from './NewTaskModal';

type Id = string | number;

// Column type for local UI state
interface IColumn {
  id: Id;
  title: string;
  content?: string;
}

// Extended task type for local UI state (includes columnId for drag-n-drop)
interface ITask extends Omit<KanbanTaskDto, 'id'> {
  id: string;
  columnId: Id;
  content: string;
}

const defaultCols: IColumn[] = [
  {
    id: 'todo',
    title: 'Todo',
    content: 'Todo',
  },
  {
    id: 'doing',
    title: 'Work in progress',
    content: 'Work in progress',
  },
  {
    id: 'done',
    title: 'Done',
    content: 'Done',
  },
];

const defaultTasks: ITask[] = [
  {
    id: '1',
    columnId: 'todo',
    content: 'List admin APIs for dashboard',
    title: 'List admin APIs for dashboard',
    status: '1',
    comments: 0,
    users: 0,
  },
  {
    id: '2',
    columnId: 'todo',
    content: 'Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation',
    title: 'Develop user registration functionality',
    status: '1',
    comments: 3,
    users: 0,
  },
  {
    id: '3',
    columnId: 'doing',
    content: 'Conduct security testing',
    title: 'Conduct security testing',
    status: '2',
    comments: 2,
    users: 0,
  },
  {
    id: '4',
    columnId: 'doing',
    content: 'Analyze competitors',
    title: 'Analyze competitors',
    status: '2',
    comments: 0,
    users: 0,
  },
  {
    id: '5',
    columnId: 'done',
    content: 'Create UI kit documentation',
    title: 'Create UI kit documentation',
    status: '3',
    comments: 1,
    users: 0,
  },
  {
    id: '6',
    columnId: 'done',
    content: 'Dev meeting',
    title: 'Dev meeting',
    status: '3',
    comments: 4,
    users: 0,
  },
  {
    id: '7',
    columnId: 'done',
    content: 'Deliver dashboard prototype',
    title: 'Deliver dashboard prototype',
    status: '3',
    comments: 15,
    users: 0,
  },
  {
    id: '8',
    columnId: 'todo',
    content: 'Optimize application performance',
    title: 'Optimize application performance',
    status: '1',
    comments: 21,
    users: 0,
  },
  {
    id: '9',
    columnId: 'todo',
    content: 'Implement data validation',
    title: 'Implement data validation',
    status: '1',
    comments: 16,
    users: 0,
  },
  {
    id: '10',
    columnId: 'todo',
    content: 'Design database schema',
    title: 'Design database schema',
    status: '1',
    comments: 56,
    users: 0,
  },
  {
    id: '11',
    columnId: 'todo',
    content: 'Integrate SSL web certificates into workflow',
    title: 'Integrate SSL web certificates into workflow',
    status: '1',
    comments: 99,
    users: 0,
  },
  {
    id: '12',
    columnId: 'doing',
    content: 'Implement error logging and monitoring',
    title: 'Implement error logging and monitoring',
    status: '2',
    comments: 76,
    users: 0,
  },
  {
    id: '13',
    columnId: 'doing',
    content: 'Design and implement responsive UI',
    title: 'Design and implement responsive UI',
    status: '2',
    comments: 45,
    users: 0,
  },
];

const KanbanBoard = () => {
  const { data: apiTasks, loading, refetch } = useFetch<IApiResponse<any[]>>('/api/tasks');
  const [columns, setColumns] = useState<IColumn[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [activeColumn, setActiveColumn] = useState<IColumn | null>(null);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [newTaskModalOpened, setNewTaskModalOpened] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<Id | null>(null);

  // Map API tasks to local task format
  useEffect(() => {
    if (apiTasks && apiTasks.data) {
      const mappedTasks: ITask[] = apiTasks.data.map((task) => {
        // Map status to columnId
        let columnId: Id = 'todo';
        if (task.status === '1' || task.status === 1) columnId = 'todo';
        else if (task.status === '2' || task.status === 2) columnId = 'doing';
        else if (task.status === '3' || task.status === 3) columnId = 'done';

        return {
          id: task.id || generateId().toString(),
          columnId,
          content: task.title || 'Untitled',
          title: task.title || 'Untitled',
          status: task.status || '1',
          comments: task.comments || 0,
          users: task.users || 0,
        };
      });
      setTasks(mappedTasks);
    }
  }, [apiTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const id = useId();

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <>
      <ScrollArea
        h="100%"
        w="100%"
        style={{
          margin: 'auto',
          display: 'flex',
          minHeight: '70vh',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        <DndContext
          id={id}
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <Box
            component="div"
            style={{
              margin: 'auto',
              display: 'flex',
              flexDirection: tablet_match ? 'column' : 'row',
              gap: '1rem',
            }}
          >
            <Box
              component="div"
              style={{
                display: 'flex',
                flexDirection: tablet_match ? 'column' : 'row',
                gap: '1rem',
              }}
            >
              <SortableContext items={columnsId}>
                {columns.map((col) => (
                  <KanbanColumn
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={openNewTaskModal}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    tasks={tasks?.filter((task) => task.columnId === col.id)}
                  />
                ))}
              </SortableContext>
            </Box>
            <Button
              mt={tablet_match ? 'lg' : 0}
              size="md"
              variant="outline"
              leftSection={<IconNewSection size={16} />}
              style={{
                width: '350px',
                minWidth: '350px',
                borderStyle: 'dashed',
              }}
              onClick={() => {
                createNewColumn();
              }}
            >
              Add a new bucket
            </Button>
          </Box>

          <Portal>
            <DragOverlay>
              {activeColumn && (
                <KanbanColumn
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={openNewTaskModal}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id,
                  )}
                />
              )}
              {activeTask && (
                <KanbanCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              )}
            </DragOverlay>
          </Portal>
        </DndContext>
      </ScrollArea>

      <NewTaskModal
        opened={newTaskModalOpened}
        onClose={() => setNewTaskModalOpened(false)}
        onSubmit={createTask}
        columnId={selectedColumnId || 'todo'}
        loading={loading}
      />
    </>
  );

  function openNewTaskModal(columnId: Id) {
    setSelectedColumnId(columnId);
    setNewTaskModalOpened(true);
  }

  async function createTask(taskData: any) {
    // In a real app, call API to create task
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    refetch();
  }

  async function deleteTask(id: Id) {
    if (typeof id === 'string') {
      // In a real app, call API to delete task
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      refetch();
    }
  }

  async function updateTask(id: Id, content: string) {
    if (typeof id === 'string') {
      const task = tasks.find((t) => t.id === id);
      // In a real app, call API to update task
      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: content, status: task?.status })
      });
      refetch();
    }
  }

  function createNewColumn() {
    const columnToAdd: IColumn = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  async function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        const newColumnId = tasks[overIndex].columnId;
        tasks[activeIndex].columnId = newColumnId;

        // Update task status in API based on new column
        const task = tasks[activeIndex];
        if (typeof task.id === 'string') {
          let newStatus: number = 1;
          if (newColumnId === 'doing') newStatus = 2;
          else if (newColumnId === 'done') newStatus = 3;

          // Silent update without refetch
          fetch(`/api/tasks/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: task.title, status: newStatus })
          });
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === 'Column';

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        // Update task status in API based on new column
        const task = tasks[activeIndex];
        if (typeof task.id === 'string') {
          let newStatus: number = 1;
          if (overId === 'doing') newStatus = 2;
          else if (overId === 'done') newStatus = 3;

          // Silent update without refetch
          fetch(`/api/tasks/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: task.title, status: newStatus })
          });
        }

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
};

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
