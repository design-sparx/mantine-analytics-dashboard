'use client';

import { useEffect } from 'react';

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

import { useApiWrite } from '@/lib/hooks/useApiWrite';
import { API_WRITE } from '@/routes/api';
import { IProductCategory } from '@/types/products';

type NewCategoryDrawer = Omit<DrawerProps, 'title' | 'children'> & {
  onCategoryCreated?: () => void;
};

export const NewCategoryDrawer = ({
  onCategoryCreated,
  ...drawerProps
}: NewCategoryDrawer) => {
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

  const {
    refetch: createCategory,
    loading,
    error: createError,
  } = useApiWrite<IProductCategory>('POST', API_WRITE.productCategories, {
    autoExecute: false,
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Category created successfully',
        color: 'green',
      });

      form.reset();

      drawerProps.onClose?.();
      onCategoryCreated?.();
    },
  });

  useEffect(() => {
    if (!createError) {
      return;
    }

    notifications.show({
      title: 'Error',
      message: createError.message || 'Failed to create category',
      color: 'red',
    });
  }, [createError]);

  const handleSubmit = (values: typeof form.values) => {
    createCategory(API_WRITE.productCategories, {
      ...values,
      createdById: 'user-demo-001',
    });
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
