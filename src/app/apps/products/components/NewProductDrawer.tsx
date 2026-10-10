'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  Button,
  Drawer,
  DrawerProps,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { useApiWrite } from '@/lib/hooks/useApiWrite';
import { useApiGet } from '@/lib/hooks/useApiGet';
import { API_WRITE } from '@/routes/api';
import { IProductCategory } from '@/types/products';

type NewProjectDrawerProps = Omit<DrawerProps, 'title' | 'children'> & {
  onProductCreated?: () => void;
};

export const NewProductDrawer = ({
  onProductCreated,
  ...drawerProps
}: NewProjectDrawerProps) => {
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useApiGet<IProductCategory[]>(API_WRITE.productCategories);

  useEffect(() => {
    if (categoriesData) {
      const categoryOptions = categoriesData.map((category) => ({
        value: category.id,
        label: category.title,
      }));
      setCategories(categoryOptions);
    }
  }, [categoriesData]);

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      title: '',
      description: '',
      price: 0,
      quantityInStock: 0,
      sku: '',
      status: 1,
      categoryId: '',
    },
    validate: {
      title: isNotEmpty('Product title cannot be empty'),
      description: isNotEmpty('Product description cannot be empty'),
      price: isNotEmpty('Price cannot be empty'),
      quantityInStock: isNotEmpty('Quantity in stock cannot be empty'),
      categoryId: isNotEmpty('Category cannot be empty'),
    },
  });

  const {
    refetch: createProduct,
    loading,
    error,
  } = useApiWrite('POST', API_WRITE.products, {
    autoExecute: false,
    onSuccess: () => {
      // Show success notification
      notifications.show({
        title: 'Success',
        message: 'Product created successfully',
        color: 'green',
      });

      // Reset form
      form.reset();

      // Close drawer
      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      // Trigger refresh of products list
      onProductCreated?.();
    },
  });

  // The hook reports a failed write as state instead of throwing, so surface it.
  useEffect(() => {
    if (error) {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    }
  }, [error]);

  const handleSubmit = (values: typeof form.values) =>
    createProduct(undefined, { ...values, createdById: 'user-demo-001' });

  return (
    <Drawer {...drawerProps} title="Create a new product">
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Title"
            placeholder="title"
            key={form.key('title')}
            {...form.getInputProps('title')}
            required
          />
          <Textarea
            label="Description"
            placeholder="description"
            key={form.key('description')}
            {...form.getInputProps('description')}
            required
          />
          <NumberInput
            label="Price"
            placeholder="price"
            {...form.getInputProps('price')}
            required
          />
          <NumberInput
            label="Quantity in stock"
            placeholder="quantity in stock"
            {...form.getInputProps('quantityInStock')}
            required
          />
          <TextInput
            label="SKU"
            placeholder="Stock Keeping Unit"
            {...form.getInputProps('sku')}
          />
          <Select
            label="Category"
            placeholder="Select category"
            data={categories}
            disabled={categoriesLoading}
            {...form.getInputProps('categoryId')}
            required
          />
          <Button type="submit" mt="md" loading={loading}>
            Create Product
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};

export default NewProductDrawer;
