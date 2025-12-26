'use client';

import { useState } from 'react';

import {
  Button,
  Drawer,
  DrawerProps,
  LoadingOverlay,
  Stack,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';


import type { ProjectDto, ApiResponse } from '@/types';

type NewProjectDrawerProps = Omit<DrawerProps, 'title' | 'children'> & {
  onCreate: (data: Partial<ProjectDto>) => Promise<ApiResponse<ProjectDto>>;
  onProjectCreated?: () => void;
};

export const NewProjectDrawer = ({
  onCreate,
  onProjectCreated,
  ...drawerProps
}: NewProjectDrawerProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      name: '',
      assignee: '',
      state: 0, // 0 = pending
      startDate: null as Date | null,
      endDate: null as Date | null,
    },
    validate: {
      name: isNotEmpty('Project name cannot be empty'),
      startDate: isNotEmpty('Start date cannot be empty'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      // Map form values to ProjectDto format
      const projectData: Partial<ProjectDto> = {
        title: values.name,
        description: '',
        status: Number(values.state),
        startDate: values.startDate?.toISOString() || null,
        dueDate: values.endDate?.toISOString() || null,
        ownerId: '',
      };

      // Use the onCreate mutation passed from parent (includes auto-refetch)
      const result = await onCreate(projectData);

      if (!result.succeeded) {
        throw new Error(result.errors?.join(', ') || 'Failed to create project');
      }

      notifications.show({
        title: 'Success',
        message: 'Project created successfully',
        color: 'green',
      });

      form.reset();

      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (error) {
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
            label="Project Name"
            placeholder="Enter project name"
            key={form.key('name')}
            {...form.getInputProps('name')}
            required
          />
          <TextInput
            label="Assignee (Optional)"
            placeholder="Enter assignee name or ID"
            key={form.key('assignee')}
            {...form.getInputProps('assignee')}
          />
          <DateInput
            label="Start Date"
            placeholder="Select start date"
            key={form.key('startDate')}
            {...form.getInputProps('startDate')}
            required
            clearable
          />
          <DateInput
            label="End Date (Optional)"
            placeholder="Select end date"
            key={form.key('endDate')}
            {...form.getInputProps('endDate')}
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
