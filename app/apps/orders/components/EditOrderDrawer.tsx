'use client';

import { useEffect, useState } from 'react';

import {
  Badge,
  Button,
  Divider,
  Drawer,
  DrawerProps,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { useAuth } from '@/hooks/useAuth';
import {
  IOrder,
  OrderStatus,
  getOrderStatusColor,
  getOrderStatusLabel,
} from '@/types/order';

interface EditOrderFormValues {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: number | string;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
}

type EditOrderDrawerProps = Omit<DrawerProps, 'title' | 'children'> & {
  order: IOrder | null;
  onOrderUpdated?: () => void;
};

export const EditOrderDrawer = ({
  order,
  onOrderUpdated,
  ...drawerProps
}: EditOrderDrawerProps) => {
  const { user, accessToken, permissions } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  // Check if the user has permission to edit orders
  const canEditOrder = permissions?.includes('Permissions.Orders.Edit');

  const form = useForm<EditOrderFormValues>({
    mode: 'controlled',
    initialValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      status: OrderStatus.Pending,
      shippingAddress: '',
      billingAddress: '',
      paymentMethod: '',
    },
    validate: {
      customerName: isNotEmpty('Customer name cannot be empty'),
      customerEmail: (value) => {
        if (!value) return 'Customer email cannot be empty';
        return /^\S+@\S+$/.test(value) ? null : 'Invalid email format';
      },
    },
  });

  const handleSubmit = async (values: EditOrderFormValues) => {
    if (!order || !isCreator || !canEditOrder) return;

    setLoading(true);
    try {
      const payload = {
        ...values,
        status: Number(values.status),
        modifiedById: user?.id,
      };

      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update order');
      }

      notifications.show({
        title: 'Success',
        message: 'Order updated successfully',
        color: 'green',
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
    if (!order || !isCreator) return;

    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete order');
      }

      notifications.show({
        title: 'Success',
        message: 'Order deleted successfully',
        color: 'green',
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
        customerName: order.customerName || '',
        customerEmail: order.customerEmail || '',
        customerPhone: order.customerPhone || '',
        status: order.status.toString() || OrderStatus.Pending.toString(),
        shippingAddress: order.shippingAddress || '',
        billingAddress: order.billingAddress || '',
        paymentMethod: order.paymentMethod || '',
      });

      // Check if the current user is the creator of the order
      setIsCreator(user?.id === order.createdById);
    }
  }, [order, user]);

  const statusOptions = [
    { value: OrderStatus.Pending.toString(), label: 'Pending' },
    { value: OrderStatus.Processing.toString(), label: 'Processing' },
    { value: OrderStatus.Shipped.toString(), label: 'Shipped' },
    { value: OrderStatus.Delivered.toString(), label: 'Delivered' },
    { value: OrderStatus.Cancelled.toString(), label: 'Cancelled' },
    { value: OrderStatus.Refunded.toString(), label: 'Refunded' },
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Drawer {...drawerProps} title="Order Details" size="lg">
      <LoadingOverlay visible={loading} />

      {!isCreator && (
        <Text color="yellow" mb="md" size="sm">
          ⚠️ You can only edit orders that you created.
        </Text>
      )}

      {order && (
        <Stack>
          {/* Order Summary */}
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={4}>
                Order #{order.id?.slice(-8)?.toUpperCase()}
              </Title>
              <Text size="sm" c="dimmed">
                Created: {order.createdAt && formatDate(order.createdAt)}
              </Text>
              {order.createdBy && (
                <Text size="sm" c="dimmed">
                  By: {order.createdBy.firstName} {order.createdBy.lastName}
                </Text>
              )}
            </div>
            <Badge
              color={getOrderStatusColor(order.status)}
              variant="light"
              size="lg"
            >
              {getOrderStatusLabel(order.status)}
            </Badge>
          </Group>

          {/* Order Items */}
          {order.orderItems && order.orderItems.length > 0 && (
            <>
              <Divider />
              <Title order={5}>Order Items</Title>
              <Stack gap="xs">
                {order.orderItems.map((item, index) => (
                  <Paper key={index} p="sm" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>
                          {item.product?.title || `Product ${item.productId}`}
                        </Text>
                        <Text size="sm" c="dimmed">
                          SKU: {item.product?.sku || 'N/A'} | Qty:{' '}
                          {item.quantity}
                        </Text>
                      </div>
                      <Text fw={500}>
                        {item.price
                          ? formatCurrency(item.price * item.quantity)
                          : 'N/A'}
                      </Text>
                    </Group>
                  </Paper>
                ))}
                {order.totalAmount && (
                  <Paper p="sm" withBorder>
                    <Group justify="space-between">
                      <Text fw={600}>Total Amount</Text>
                      <Text fw={600} size="lg">
                        {formatCurrency(order.totalAmount)}
                      </Text>
                    </Group>
                  </Paper>
                )}
              </Stack>
            </>
          )}

          <Divider />

          {/* Edit Form */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Title order={4}>Customer Information</Title>
              <TextInput
                label="Customer Name"
                placeholder="Enter customer name"
                key={form.key('customerName')}
                {...form.getInputProps('customerName')}
                required
                disabled={!isCreator}
              />
              <TextInput
                label="Customer Email"
                placeholder="Enter customer email"
                key={form.key('customerEmail')}
                {...form.getInputProps('customerEmail')}
                required
                disabled={!isCreator}
              />
              <TextInput
                label="Customer Phone"
                placeholder="Enter customer phone"
                key={form.key('customerPhone')}
                {...form.getInputProps('customerPhone')}
                disabled={!isCreator}
              />

              <Divider />

              <Title order={4}>Addresses</Title>
              <Textarea
                label="Shipping Address"
                placeholder="Enter shipping address"
                key={form.key('shippingAddress')}
                {...form.getInputProps('shippingAddress')}
                disabled={!isCreator}
              />
              <Textarea
                label="Billing Address"
                placeholder="Enter billing address"
                key={form.key('billingAddress')}
                {...form.getInputProps('billingAddress')}
                disabled={!isCreator}
              />

              <Divider />

              <Title order={4}>Payment & Status</Title>
              <TextInput
                label="Payment Method"
                placeholder="e.g., Credit Card, PayPal, Cash"
                key={form.key('paymentMethod')}
                {...form.getInputProps('paymentMethod')}
                disabled={!isCreator}
              />
              <Select
                label="Status"
                data={statusOptions}
                key={form.key('status')}
                {...form.getInputProps('status')}
                required
                disabled={!isCreator}
              />

              <Group justify="space-between" mt="xl">
                <Button
                  color="red"
                  onClick={handleDelete}
                  disabled={!isCreator}
                  variant="outline"
                >
                  Delete Order
                </Button>
                <Button type="submit" disabled={!isCreator} loading={loading}>
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
