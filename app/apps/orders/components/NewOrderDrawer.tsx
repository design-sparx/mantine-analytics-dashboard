'use client';

import { useState } from 'react';

import {
  Button,
  Drawer,
  DrawerProps,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import type { OrderDto } from '@/types';

interface NewOrderFormValues {
  product: string;
  date: string;
  total: number;
  status: number;
  payment_method: number;
}

type NewOrderDrawerProps = Omit<DrawerProps, 'title' | 'children'> & {
  onOrderCreated?: () => void;
};

export const NewOrderDrawer = ({
  onOrderCreated,
  ...drawerProps
}: NewOrderDrawerProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<NewOrderFormValues>({
    mode: 'controlled',
    initialValues: {
      product: '',
      date: new Date().toISOString().split('T')[0],
      total: 0,
      status: 1, // Pending
      payment_method: 1, // Credit Card
    },
    validate: {
      product: isNotEmpty('Product name cannot be empty'),
      total: (value) => (value > 0 ? null : 'Total must be greater than 0'),
    },
  });

  const handleSubmit = async (values: NewOrderFormValues) => {
    setLoading(true);
    try {
      // Note: In this mock template, orders are read-only from JSON files
      // For a real implementation, you would send a POST request here
      notifications.show({
        title: 'Mock Data System',
        message: 'This template uses mock data. Order creation is simulated.',
        color: 'blue',
      });

      form.reset();

      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to create order',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: '1', label: 'Pending' },
    { value: '2', label: 'Processing' },
    { value: '3', label: 'Shipped' },
    { value: '4', label: 'Delivered' },
    { value: '5', label: 'Cancelled' },
  ];

  const paymentMethodOptions = [
    { value: '1', label: 'Credit Card' },
    { value: '2', label: 'Debit Card' },
    { value: '3', label: 'PayPal' },
    { value: '4', label: 'Cash' },
    { value: '5', label: 'Bank Transfer' },
  ];

  return (
    <Drawer {...drawerProps} title="Create a new order" size="lg">
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Title order={4}>Order Information</Title>
          <TextInput
            label="Product"
            placeholder="Enter product name"
            key={form.key('product')}
            {...form.getInputProps('product')}
            required
          />
          <TextInput
            label="Date"
            type="date"
            key={form.key('date')}
            {...form.getInputProps('date')}
            required
          />
          <NumberInput
            label="Total"
            placeholder="Enter total amount"
            min={0}
            step={0.01}
            decimalScale={2}
            prefix="$"
            key={form.key('total')}
            {...form.getInputProps('total')}
            required
          />
          <Select
            label="Status"
            data={statusOptions}
            key={form.key('status')}
            {...form.getInputProps('status')}
            required
          />
          <Select
            label="Payment Method"
            data={paymentMethodOptions}
            key={form.key('payment_method')}
            {...form.getInputProps('payment_method')}
            required
          />

          <Button type="submit" mt="md" loading={loading}>
            Create Order
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};
