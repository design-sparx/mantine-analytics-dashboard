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
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';



type NewCategoryDrawer = Omit<DrawerProps, 'title' | 'children'> & {
  onCategoryCreated?: () => void;
};

export const NewCategoryDrawer = ({
  onCategoryCreated,
  ...drawerProps
}: NewCategoryDrawer) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      title: '',
      description: '',
    },
    validate: {
      title: isNotEmpty('Category title cannot be empty'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        createdById: 'user-demo-001',
      };

      const response = await fetch('/api/product-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create category');
      }

      notifications.show({
        title: 'Success',
        message: 'Category created successfully',
        color: 'green',
      });

      form.reset();

      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      if (onCategoryCreated) {
        onCategoryCreated();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to create category',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer {...drawerProps} title="Create a new product category">
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Title"
            placeholder="Category title"
            key={form.key('title')}
            {...form.getInputProps('title')}
            required
          />
          <Textarea
            label="Description"
            placeholder="Category description"
            key={form.key('description')}
            {...form.getInputProps('description')}
          />
          <Button type="submit" mt="md" loading={loading}>
            Create Category
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};

export default NewCategoryDrawer;
