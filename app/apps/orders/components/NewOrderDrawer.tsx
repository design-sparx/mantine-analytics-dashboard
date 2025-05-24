'use client';

import { useEffect, useState } from 'react';

import {
  ActionIcon,
  Button,
  Divider,
  Drawer,
  DrawerProps,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconTrash } from '@tabler/icons-react';

import { useAuth } from '@/hooks/useAuth';
import { OrderStatus } from '@/types/order';
import { IProduct } from '@/types/products';

interface OrderItem {
  productId: string;
  quantity: number;
}

interface NewOrderFormValues {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  status: number;
  orderItems: OrderItem[];
}

type NewOrderDrawerProps = Omit<DrawerProps, 'title' | 'children'> & {
  onOrderCreated?: () => void;
};

export const NewOrderDrawer = ({
  onOrderCreated,
  ...drawerProps
}: NewOrderDrawerProps) => {
  const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [productsLoading, setProductsLoading] = useState(false);

  const form = useForm<NewOrderFormValues>({
    mode: 'controlled',
    initialValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      shippingAddress: '',
      billingAddress: '',
      paymentMethod: '',
      status: OrderStatus.Pending,
      orderItems: [{ productId: '', quantity: 1 }],
    },
    validate: {
      customerName: isNotEmpty('Customer name cannot be empty'),
      customerEmail: (value) => {
        if (!value) return 'Customer email cannot be empty';
        return /^\S+@\S+$/.test(value) ? null : 'Invalid email format';
      },
      orderItems: {
        productId: isNotEmpty('Product is required'),
        quantity: (value) =>
          value > 0 ? null : 'Quantity must be greater than 0',
      },
    },
  });

  // Fetch products when drawer opens
  useEffect(() => {
    if (drawerProps.opened) {
      fetchProducts();
    }
  }, [drawerProps.opened]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.succeeded && result.data) {
        const productOptions = result.data.map((product: IProduct) => ({
          value: product.id,
          label: `${product.title} - $${product.price}`,
        }));
        setProducts(productOptions);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSubmit = async (values: NewOrderFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        status: Number(values.status),
        createdById: user?.id,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      notifications.show({
        title: 'Success',
        message: 'Order created successfully',
        color: 'green',
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

  const addOrderItem = () => {
    form.insertListItem('orderItems', { productId: '', quantity: 1 });
  };

  const removeOrderItem = (index: number) => {
    form.removeListItem('orderItems', index);
  };

  const statusOptions = [
    { value: OrderStatus.Pending.toString(), label: 'Pending' },
    { value: OrderStatus.Processing.toString(), label: 'Processing' },
    { value: OrderStatus.Shipped.toString(), label: 'Shipped' },
    { value: OrderStatus.Delivered.toString(), label: 'Delivered' },
    { value: OrderStatus.Cancelled.toString(), label: 'Cancelled' },
  ];

  return (
    <Drawer {...drawerProps} title="Create a new order" size="lg">
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {/* Customer Information */}
          <Title order={4}>Customer Information</Title>
          <TextInput
            label="Customer Name"
            placeholder="Enter customer name"
            key={form.key('customerName')}
            {...form.getInputProps('customerName')}
            required
          />
          <TextInput
            label="Customer Email"
            placeholder="Enter customer email"
            key={form.key('customerEmail')}
            {...form.getInputProps('customerEmail')}
            required
          />
          <TextInput
            label="Customer Phone"
            placeholder="Enter customer phone"
            key={form.key('customerPhone')}
            {...form.getInputProps('customerPhone')}
          />

          <Divider />

          {/* Addresses */}
          <Title order={4}>Addresses</Title>
          <Textarea
            label="Shipping Address"
            placeholder="Enter shipping address"
            key={form.key('shippingAddress')}
            {...form.getInputProps('shippingAddress')}
          />
          <Textarea
            label="Billing Address"
            placeholder="Enter billing address"
            key={form.key('billingAddress')}
            {...form.getInputProps('billingAddress')}
          />

          <Divider />

          {/* Payment & Status */}
          <Title order={4}>Payment & Status</Title>
          <TextInput
            label="Payment Method"
            placeholder="e.g., Credit Card, PayPal, Cash"
            key={form.key('paymentMethod')}
            {...form.getInputProps('paymentMethod')}
          />
          <Select
            label="Status"
            data={statusOptions}
            key={form.key('status')}
            {...form.getInputProps('status')}
            required
          />

          <Divider />

          {/* Order Items */}
          <Group justify="space-between">
            <Title order={4}>Order Items</Title>
            <Button
              variant="light"
              size="xs"
              leftSection={<IconPlus size={14} />}
              onClick={addOrderItem}
            >
              Add Item
            </Button>
          </Group>

          {form.values.orderItems.map((item, index) => (
            <Group key={index} align="flex-end">
              <Select
                label="Product"
                placeholder="Select product"
                data={products}
                disabled={productsLoading}
                style={{ flex: 1 }}
                {...form.getInputProps(`orderItems.${index}.productId`)}
                required
              />
              <NumberInput
                label="Quantity"
                placeholder="Qty"
                min={1}
                style={{ width: 100 }}
                {...form.getInputProps(`orderItems.${index}.quantity`)}
                required
              />
              {form.values.orderItems.length > 1 && (
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => removeOrderItem(index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              )}
            </Group>
          ))}

          <Button type="submit" mt="md" loading={loading}>
            Create Order
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};
