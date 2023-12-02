'use client';

import { useMemo, useState } from 'react';
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
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { KanbanCard, KanbanColumn } from '@/components';
import { Id, KanbanColumn as IColumn, KanbanTask as ITask } from '@/types';
import { IconNewSection, IconPlus } from '@tabler/icons-react';
import { Box, Button, Portal, ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const defaultCols: IColumn[] = [
  {
    id: 'todo',
    title: 'Todo',
  },
  {
    id: 'doing',
    title: 'Work in progress',
  },
  {
    id: 'done',
    title: 'Done',
  },
];

const defaultTasks: ITask[] = [
  {
    id: '1',
    columnId: 'todo',
    content: 'List admin APIs for dashboard',
    comments: 0,
  },
  {
    id: '2',
    columnId: 'todo',
    content:
      'Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation',
    comments: 3,
  },
  {
    id: '3',
    columnId: 'doing',
    content: 'Conduct security testing',
    comments: 2,
  },
  {
    id: '4',
    columnId: 'doing',
    content: 'Analyze competitors',
    comments: 0,
  },
  {
    id: '5',
    columnId: 'done',
    content: 'Create UI kit documentation',
    comments: 1,
  },
  {
    id: '6',
    columnId: 'done',
    content: 'Dev meeting',
    comments: 4,
  },
  {
    id: '7',
    columnId: 'done',
    content: 'Deliver dashboard prototype',
    comments: 15,
  },
  {
    id: '8',
    columnId: 'todo',
    content: 'Optimize application performance',
    comments: 21,
  },
  {
    id: '9',
    columnId: 'todo',
    content: 'Implement data validation',
    comments: 16,
  },
  {
    id: '10',
    columnId: 'todo',
    content: 'Design database schema',
    comments: 56,
  },
  {
    id: '11',
    columnId: 'todo',
    content: 'Integrate SSL web certificates into workflow',
    comments: 99,
  },
  {
    id: '12',
    columnId: 'doing',
    content: 'Implement error logging and monitoring',
    comments: 76,
  },
  {
    id: '13',
    columnId: 'doing',
    content: 'Design and implement responsive UI',
    comments: 45,
  },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState<IColumn[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTasks] = useState<ITask[]>(defaultTasks);
  const [activeColumn, setActiveColumn] = useState<IColumn | null>(null);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  return (
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
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
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
                createTask={createTask}
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
  );

  function createTask(columnId: Id) {
    const newTask: ITask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
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

  function onDragOver(event: DragOverEvent) {
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

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === 'Column';

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

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
