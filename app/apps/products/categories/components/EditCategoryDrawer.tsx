'use client';

import { useEffect, useState } from 'react';

import {
  Button,
  Drawer,
  DrawerProps,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';


import { IProductCategory } from '@/types/products';

type EditCategoryDrawer = Omit<DrawerProps, 'title' | 'children'> & {
  productCategory: IProductCategory | null;
  onCategoryUpdated?: () => void;
};

export const EditCategoryDrawer = ({
  productCategory,
  onCategoryUpdated,
  ...drawerProps
}: EditCategoryDrawer) => {
  const [loading, setLoading] = useState(false);
  const [isCreator, setIsCreator] = useState(true);

  // In a mock data template, all users can edit
  const canEditProductCategory = true;

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
    if (!productCategory || !isCreator || !canEditProductCategory) return;

    setLoading(true);
    try {
      const payload = {
        ...values,
        modifiedById: 'user-demo-001',
      };

      const response = await fetch(
        `/api/product-categories/${productCategory.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

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

      if (onCategoryUpdated) {
        onCategoryUpdated();
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

  const handleDelete = async () => {
    if (!productCategory || !isCreator) return;

    if (
      !window.confirm('Are you sure you want to delete this product category?')
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/product-categories/${productCategory.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete product category');
      }

      // Show success notification
      notifications.show({
        title: 'Success',
        message: 'Product deleted successfully',
        color: 'green',
      });

      // Close drawer
      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      // Trigger refresh of products list
      if (onCategoryUpdated) {
        onCategoryUpdated();
      }
    } catch (error) {
      // Show error notification
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to delete product',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productCategory) {
      form.setValues({
        title: productCategory.title || '',
        description: productCategory.description || '',
      });

      // Check if the current user is the creator of the product
      setIsCreator(true); // Auth removed - all users can edit for demo purposes
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCategory]);

  return (
    <Drawer {...drawerProps} title="Edit product category">
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
          <Group justify="space-between" mt="xl">
            <Button color="red" onClick={handleDelete} disabled={!isCreator}>
              Delete Product
            </Button>
            <Button type="submit" disabled={!isCreator}>
              Update Product
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};

export default EditCategoryDrawer;
