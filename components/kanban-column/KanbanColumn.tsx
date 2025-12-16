'use client';

import { useMemo, useState } from 'react';

import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ActionIcon,
  Badge,
  Button,
  Flex,
  Menu,
  Paper,
  PaperProps,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconDots, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';

import { KanbanCard } from '@/components';
import type { KanbanTaskDto, TaskStatus, Id } from '@/types';

// Column type for local UI state
interface IColumn {
  id: Id;
  title: string;
}

// Extended task type for local UI state (includes columnId for drag-n-drop)
interface ITask extends Omit<KanbanTaskDto, 'id'> {
  id: string;
  columnId: Id;
  content: string;
}

const ICON_SIZE = 18;

type Props = {
  column: IColumn;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: ITask[];
};

const KanbanColumn = (props: Props) => {
  const theme = useMantineTheme();
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;
  const [editMode, setEditMode] = useState(false);
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const PAPER_PROPS: PaperProps = {
    pb: tablet_match ? 'md' : 'xs',
    style: {
      width: tablet_match ? '100%' : '350px',
      // height: rem(600),
      // maxHeight: rem(600),
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: tablet_match ? theme.white : 'transparent',
    },
  };

  const tasksIds = useMemo(() => {
    return tasks?.map((task) => task.id) || [];
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const confirmModal = (column: IColumn) =>
    modals.openConfirmModal({
      title: `Delete ${column.title}?`,
      centered: true,
      children: (
        <Text size="sm">All tasks in this bucket will also be deleted.</Text>
      ),
      labels: { confirm: 'Delete bucket', cancel: "No don't delete it" },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        deleteColumn(column.id);
      },
    });

  if (isDragging) {
    return (
      <Paper
        withBorder
        ref={setNodeRef}
        style={{
          ...style,
          backgroundColor: theme.colors.dark[0],
          opacity: 0.3,
          width: rem(350),
          height: rem(500),
          maxHeight: rem(500),
          display: 'flex',
          flexDirection: 'column',
        }}
      ></Paper>
    );
  }

  return (
    <Paper ref={setNodeRef} style={style} {...PAPER_PROPS}>
      {/* Column title */}
      <Flex
        p="xs"
        align="center"
        justify="space-between"
        style={{
          cursor: 'grab',
          borderBottom: `1px solid ${theme.colors.dark[1]}`,
        }}
        {...attributes}
        {...listeners}
      >
        <Flex gap="md" align="center">
          {!editMode && (
            <>
              <Text fz="lg" fw={600}>
                {column.title}
              </Text>
              <Badge variant="dot">{tasks?.length}</Badge>
            </>
          )}
          {editMode && (
            <TextInput
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                setEditMode(false);
              }}
            />
          )}
        </Flex>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle">
              <IconDots size={ICON_SIZE} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={ICON_SIZE} />}
              onClick={() => {
                setEditMode(true);
              }}
            >
              Rename
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={ICON_SIZE} />}
              onClick={() => {
                confirmModal(column);
              }}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      {/* Column task container */}
      <ScrollArea
        style={{ overflowX: 'hidden', overflowY: 'auto', maxHeight: rem(500) }}
      >
        <Stack gap="sm" px="sm" py="md">
          <SortableContext items={tasksIds}>
            {tasks?.length > 0 &&
              tasks?.map((task) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
          </SortableContext>
        </Stack>
      </ScrollArea>
      {/* Column footer */}
      <Button
        mx="sm"
        variant="outline"
        leftSection={<IconPlus size={ICON_SIZE} />}
        onClick={() => {
          createTask(column.id);
        }}
      >
        Add task
      </Button>
    </Paper>
  );
};

export default KanbanColumn;
