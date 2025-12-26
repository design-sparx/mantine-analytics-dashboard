'use client';

import { useEffect } from 'react';

import { Button, Group, Modal, NumberInput, Stack, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';

import type { KanbanTaskDto, TaskStatus } from '@/types';

type NewTaskModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<KanbanTaskDto>) => void;
  columnId: string | number;
  loading?: boolean;
};

export const NewTaskModal = ({
  opened,
  onClose,
  onSubmit,
  columnId,
  loading = false,
}: NewTaskModalProps) => {
  const form = useForm<{
    title: string;
    comments: number;
    users: number;
  }>({
    initialValues: {
      title: '',
      comments: 0,
      users: 0,
    },
    validate: {
      title: (value) =>
        value.trim().length === 0 ? 'Task title is required' : null,
      comments: (value) => (value < 0 ? 'Comments cannot be negative' : null),
      users: (value) => (value < 0 ? 'Users cannot be negative' : null),
    },
  });

  useEffect(() => {
    if (!opened) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const handleSubmit = (values: typeof form.values) => {
    // Map columnId to status string
    let status: string = '1'; // todo
    if (columnId === 'doing') status = '2';
    else if (columnId === 'done') status = '3';

    const newTask: Partial<KanbanTaskDto> = {
      title: values.title,
      status,
      comments: values.comments,
      users: values.users,
    };

    onSubmit(newTask);
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add New Task"
      size="md"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Textarea
            label="Task Title"
            placeholder="Enter task title or description"
            required
            autosize
            minRows={3}
            maxRows={6}
            {...form.getInputProps('title')}
          />

          <NumberInput
            label="Comments Count"
            placeholder="0"
            min={0}
            {...form.getInputProps('comments')}
          />

          <NumberInput
            label="Users Count"
            placeholder="0"
            min={0}
            {...form.getInputProps('users')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Add Task
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
