'use client';

import { useState } from 'react';

import {
  Button,
  Drawer,
  DrawerProps,
  Grid,
  LoadingOverlay,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface NewCustomerFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  status: number;
}

type NewCustomerDrawerProps = Omit<DrawerProps, 'title' | 'children'> & {
  onCustomerCreated?: () => void;
};

export const NewCustomerDrawer = ({
  onCustomerCreated,
  ...drawerProps
}: NewCustomerDrawerProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<NewCustomerFormValues>({
    mode: 'controlled',
    initialValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      street: '',
      city: '',
      state: '',
      country: 'USA',
      zipCode: '',
      status: 1, // Active
    },
    validate: {
      name: isNotEmpty('Name cannot be empty'),
      email: isEmail('Invalid email'),
      phone: isNotEmpty('Phone cannot be empty'),
    },
  });

  const handleSubmit = async (values: NewCustomerFormValues) => {
    setLoading(true);
    try {
      // Note: In this mock template, customers are read-only from JSON files
      // For a real implementation, you would send a POST request here
      notifications.show({
        title: 'Mock Data System',
        message: 'This template uses mock data. Customer creation is simulated.',
        color: 'blue',
      });

      form.reset();

      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      if (onCustomerCreated) {
        onCustomerCreated();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to create customer',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: '1', label: 'Active' },
    { value: '2', label: 'Inactive' },
    { value: '3', label: 'Blocked' },
  ];

  return (
    <Drawer {...drawerProps} title="Create a new customer" size="lg">
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Title order={4}>Customer Information</Title>
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

          <Button type="submit" mt="md" loading={loading}>
            Create Customer
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};
