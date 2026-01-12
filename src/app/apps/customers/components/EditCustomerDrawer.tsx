'use client';

import { useEffect, useState } from 'react';

import {
  Avatar,
  Badge,
  Button,
  Drawer,
  DrawerProps,
  Grid,
  Group,
  LoadingOverlay,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import type { CustomerDto, CustomerStatus } from '@/types';

interface EditCustomerFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  status: number | string;
}

type EditCustomerDrawerProps = Omit<DrawerProps, 'title' | 'children'> & {
  customer: CustomerDto | null;
  onCustomerUpdated?: () => void;
};

export const EditCustomerDrawer = ({
  customer,
  onCustomerUpdated,
  ...drawerProps
}: EditCustomerDrawerProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<EditCustomerFormValues>({
    mode: 'controlled',
    initialValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      status: 1,
    },
    validate: {
      name: isNotEmpty('Name cannot be empty'),
      email: isEmail('Invalid email'),
      phone: isNotEmpty('Phone cannot be empty'),
    },
  });

  const handleSubmit = async (values: EditCustomerFormValues) => {
    if (!customer?.id) return;

    setLoading(true);
    try {
      // Note: In this mock template, customers are read-only from JSON files
      // For a real implementation, you would send a PUT request here
      notifications.show({
        title: 'Mock Data System',
        message: 'This template uses mock data. Customer updates are simulated.',
        color: 'blue',
      });

      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      if (onCustomerUpdated) {
        onCustomerUpdated();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to update customer',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customer?.id) return;

    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    setLoading(true);
    try {
      // Note: In this mock template, customers are read-only from JSON files
      // For a real implementation, you would send a DELETE request here
      notifications.show({
        title: 'Mock Data System',
        message: 'This template uses mock data. Customer deletion is simulated.',
        color: 'blue',
      });

      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      if (onCustomerUpdated) {
        onCustomerUpdated();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to delete customer',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customer) {
      form.setValues({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        street: customer.address?.street || '',
        city: customer.address?.city || '',
        state: customer.address?.state || '',
        country: customer.address?.country || '',
        zipCode: customer.address?.zipCode || '',
        status: customer.status?.toString() || '1',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const statusOptions = [
    { value: '1', label: 'Active' },
    { value: '2', label: 'Inactive' },
    { value: '3', label: 'Blocked' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status?: CustomerStatus): string => {
    if (!status) return 'gray';
    const statusMap: Record<number, string> = {
      1: 'green',
      2: 'gray',
      3: 'red',
    };
    return statusMap[status as number] || 'gray';
  };

  const getStatusLabel = (status?: CustomerStatus): string => {
    if (!status) return 'Unknown';
    const statusMap: Record<number, string> = {
      1: 'Active',
      2: 'Inactive',
      3: 'Blocked',
    };
    return statusMap[status as number] || 'Unknown';
  };

  return (
    <Drawer {...drawerProps} title="Customer Details" size="lg">
      <LoadingOverlay visible={loading} />

      {customer && (
        <Stack>
          <Group justify="space-between" align="flex-start">
            <Group gap="sm">
              <Avatar src={customer.avatar} alt={customer.name} radius="xl" size="lg" />
              <div>
                <Title order={4}>{customer.name}</Title>
                <Text size="sm" c="dimmed">
                  {customer.company || 'No company'}
                </Text>
              </div>
            </Group>
            <Badge
              color={getStatusColor(customer.status)}
              variant="light"
              size="lg"
            >
              {getStatusLabel(customer.status)}
            </Badge>
          </Group>

          <Group grow>
            <Stack gap={4}>
              <Text size="xs" c="dimmed">
                Total Orders
              </Text>
              <Text size="lg" fw={600}>
                {customer.totalOrders || 0}
              </Text>
            </Stack>
            <Stack gap={4}>
              <Text size="xs" c="dimmed">
                Total Spent
              </Text>
              <Text size="lg" fw={600}>
                {formatCurrency(customer.totalSpent || 0)}
              </Text>
            </Stack>
          </Group>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Title order={4} mt="md">
                Customer Information
              </Title>
              <TextInput
                label="Name"
                placeholder="Enter customer name"
                key={form.key('name')}
                {...form.getInputProps('name')}
                required
              />
              <TextInput
                label="Email"
                placeholder="customer@email.com"
                key={form.key('email')}
                {...form.getInputProps('email')}
                required
              />
              <TextInput
                label="Phone"
                placeholder="+1 (555) 000-0000"
                key={form.key('phone')}
                {...form.getInputProps('phone')}
                required
              />
              <TextInput
                label="Company"
                placeholder="Enter company name (optional)"
                key={form.key('company')}
                {...form.getInputProps('company')}
              />

              <Title order={4} mt="md">
                Address
              </Title>
              <TextInput
                label="Street"
                placeholder="123 Main St"
                key={form.key('street')}
                {...form.getInputProps('street')}
              />
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="City"
                    placeholder="City"
                    key={form.key('city')}
                    {...form.getInputProps('city')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="State"
                    placeholder="State"
                    key={form.key('state')}
                    {...form.getInputProps('state')}
                  />
                </Grid.Col>
              </Grid>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Country"
                    placeholder="Country"
                    key={form.key('country')}
                    {...form.getInputProps('country')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Zip Code"
                    placeholder="00000"
                    key={form.key('zipCode')}
                    {...form.getInputProps('zipCode')}
                  />
                </Grid.Col>
              </Grid>

              <Select
                label="Status"
                data={statusOptions}
                key={form.key('status')}
                {...form.getInputProps('status')}
                required
              />

              <Group justify="space-between" mt="xl">
                <Button color="red" onClick={handleDelete} variant="outline">
                  Delete Customer
                </Button>
                <Button type="submit" loading={loading}>
                  Update Customer
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      )}
    </Drawer>
  );
};
