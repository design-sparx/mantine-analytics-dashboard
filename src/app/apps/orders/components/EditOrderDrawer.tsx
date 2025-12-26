'use client';

import { useEffect, useState } from 'react';

import {
  Badge,
  Button,
  Drawer,
  DrawerProps,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import type { OrderDto, OrderStatus, PaymentMethod } from '@/types';

interface EditOrderFormValues {
  product: string;
  date: string;
  total: number;
  status: number | string;
  payment_method: number | string;
}

type EditOrderDrawerProps = Omit<DrawerProps, 'title' | 'children'> & {
  order: OrderDto | null;
  onOrderUpdated?: () => void;
};

export const EditOrderDrawer = ({
  order,
  onOrderUpdated,
  ...drawerProps
}: EditOrderDrawerProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<EditOrderFormValues>({
    mode: 'controlled',
    initialValues: {
      product: '',
      date: '',
      total: 0,
      status: 1,
      payment_method: 1,
    },
    validate: {
      product: isNotEmpty('Product name cannot be empty'),
      total: (value) => (value > 0 ? null : 'Total must be greater than 0'),
    },
  });

  const handleSubmit = async (values: EditOrderFormValues) => {
    if (!order?.id) return;

    setLoading(true);
    try {
      // Note: In this mock template, orders are read-only from JSON files
      // For a real implementation, you would send a PUT request here
      notifications.show({
        title: 'Mock Data System',
        message: 'This template uses mock data. Order updates are simulated.',
        color: 'blue',
      });

      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to update order',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!order?.id) return;

    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    setLoading(true);
    try {
      // Note: In this mock template, orders are read-only from JSON files
      // For a real implementation, you would send a DELETE request here
      notifications.show({
        title: 'Mock Data System',
        message: 'This template uses mock data. Order deletion is simulated.',
        color: 'blue',
      });

      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to delete order',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (order) {
      form.setValues({
        product: order.product || '',
        date: order.date || '',
        total: order.total || 0,
        status: order.status?.toString() || '1',
        payment_method: order.payment_method?.toString() || '1',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status?: OrderStatus): string => {
    if (!status) return 'gray';
    const statusMap: Record<number, string> = {
      1: 'yellow',
      2: 'blue',
      3: 'orange',
      4: 'green',
      5: 'red',
    };
    return statusMap[status as number] || 'gray';
  };

  const getStatusLabel = (status?: OrderStatus): string => {
    if (!status) return 'Unknown';
    const statusMap: Record<number, string> = {
      1: 'Pending',
      2: 'Processing',
      3: 'Shipped',
      4: 'Delivered',
      5: 'Cancelled',
    };
    return statusMap[status as number] || 'Unknown';
  };

  return (
    <Drawer {...drawerProps} title="Order Details" size="lg">
      <LoadingOverlay visible={loading} />

      {order && (
        <Stack>
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={4}>
                Order #{order.id?.slice(-8)?.toUpperCase()}
              </Title>
              <Text size="sm" c="dimmed">
                Date: {order.date && formatDate(order.date)}
              </Text>
            </div>
            <Badge
              color={getStatusColor(order.status)}
              variant="light"
              size="lg"
            >
              {getStatusLabel(order.status)}
            </Badge>
          </Group>

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

              <Group justify="space-between" mt="xl">
                <Button color="red" onClick={handleDelete} variant="outline">
                  Delete Order
                </Button>
                <Button type="submit" loading={loading}>
                  Update Order
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      )}
    </Drawer>
  );
};
