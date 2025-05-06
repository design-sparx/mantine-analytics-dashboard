'use client';

import { useState } from 'react';

import {
  Button,
  Drawer,
  DrawerProps,
  LoadingOverlay,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { useAuth } from '@/hooks/useAuth';

type NewProjectDrawerProps = Omit<DrawerProps, 'title' | 'children'> & {
  onProjectCreated?: () => void;
};

export const NewProjectDrawer = ({
  onProjectCreated,
  ...drawerProps
}: NewProjectDrawerProps) => {
  const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      title: '',
      description: '',
      status: 1,
      startDate: null,
      dueDate: null,
    },
    validate: {
      title: isNotEmpty('Project title cannot be empty'),
      description: isNotEmpty('Project description cannot be empty'),
      startDate: isNotEmpty('Start date cannot be empty'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      // Format dates for API
      const payload = {
        ...values,
        startDate: values.startDate
          ? new Date(values.startDate).toISOString()
          : null,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        ownerId: user?.id,
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project');
      }

      // Show success notification
      notifications.show({
        title: 'Success',
        message: 'Project created successfully',
        color: 'green',
      });

      // Reset form
      form.reset();

      // Close drawer
      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      // Trigger refresh of projects list
      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (error) {
      // Show error notification
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to create project',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer {...drawerProps} title="Create a new project">
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Project title"
            placeholder="Project title"
            key={form.key('title')}
            {...form.getInputProps('title')}
            required
          />
          <Textarea
            label="Project description"
            placeholder="Project description"
            key={form.key('description')}
            {...form.getInputProps('description')}
            required
          />
          <DateInput
            label="Start date"
            placeholder="Start date"
            key={form.key('startDate')}
            {...form.getInputProps('startDate')}
            clearable
          />
          <DateInput
            label="Due date"
            placeholder="Due date"
            key={form.key('dueDate')}
            {...form.getInputProps('dueDate')}
            clearable
          />
          <Button type="submit" mt="md" loading={loading}>
            Create Project
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};

export default NewProjectDrawer;
