'use client';

import { useState } from 'react';
import { Id, KanbanTask as ITask } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconDots,
  IconEdit,
  IconMessageCircle,
  IconTrash,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Menu,
  Paper,
  PaperProps,
  Text,
  Textarea,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import classes from './KanbanCard.module.css';

const AVATARS = [
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
];

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

const ICON_SIZE = 18;

type Props = {
  task: ITask;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
};

const KanbanCard = (props: Props) => {
  const { task, deleteTask, updateTask } = props;
  const theme = useMantineTheme();
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: editMode,
  });
  const { hovered } = useHover();
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  const confirmModal = (task: ITask) =>
    modals.openConfirmModal({
      title: `Delete Task?`,
      centered: true,
      children: <Text size="sm">This task will be deleted</Text>,
      labels: { confirm: 'Delete bucket', cancel: "No don't delete it" },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        deleteTask(task.id);
      },
    });

  if (isDragging) {
    return (
      <Box ref={setNodeRef} style={style} p="sm" className={classes.dragBox} />
    );
  }

  if (editMode) {
    return (
      <Paper
        component="div"
        ref={setNodeRef}
        p="md"
        shadow="md"
        radius="md"
        {...attributes}
        {...listeners}
        style={{
          ...style,
          minHeight: '100px',
          display: 'flex',
          textAlign: 'left',
          cursor: 'grab',
          position: 'relative',
          alignItems: 'center',
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors[theme.primaryColor][8],
        }}
      >
        <Textarea
          style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            borderRadius: theme.radius.md,
          }}
          mx="auto"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </Paper>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      className={classes.card}
      shadow="md"
      radius="md"
      style={{
        ...style,
        cursor: 'grab',
      }}
      {...attributes}
      {...listeners}
    >
      <Card.Section p="sm">
        <Flex>
          <Text
            my="auto"
            size="sm"
            style={{
              height: '90%',
              width: '100%',
              overflowY: 'hidden',
              overflowX: 'hidden',
            }}
          >
            {task.content}
          </Text>
          <Menu shadow="md" position="left-start" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDots size={ICON_SIZE} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Tooltip label="Rename task">
                <Menu.Item
                  leftSection={<IconEdit size={ICON_SIZE} />}
                  onClick={toggleEditMode}
                >
                  Rename
                </Menu.Item>
              </Tooltip>
              <Tooltip label="Delete task">
                <Menu.Item
                  leftSection={<IconTrash size={ICON_SIZE} />}
                  onClick={() => {
                    confirmModal(task);
                  }}
                >
                  Delete
                </Menu.Item>
              </Tooltip>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </Card.Section>
      <Card.Section>
        <Divider />
      </Card.Section>
      <Card.Section p="sm">
        <Flex gap="md" align="center" justify="space-between">
          <Avatar.Group spacing="xs">
            <Tooltip label="Anne Doe">
              <Avatar src={AVATARS[0]} size="sm" radius="xl" />
            </Tooltip>
            <Tooltip label="Alex Doe">
              <Avatar src={AVATARS[1]} size="sm" radius="xl" />
            </Tooltip>
            <Tooltip label="Abby Doe">
              <Avatar src={AVATARS[2]} size="sm" radius="xl" />
            </Tooltip>
            <Tooltip label="and 5 others">
              <Avatar size="sm" radius="xl">
                +5
              </Avatar>
            </Tooltip>
          </Avatar.Group>
          {task?.comments !== undefined && (
            <Button
              rightSection={<IconMessageCircle size={ICON_SIZE} />}
              size="compact.md"
              variant="subtle"
              radius="md"
            >
              {task.comments}
            </Button>
          )}
        </Flex>
      </Card.Section>
    </Card>
  );
};

export default KanbanCard;
