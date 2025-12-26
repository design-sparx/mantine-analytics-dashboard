'use client';

import { useState } from 'react';

import {
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
import { DateInput } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import type { InvoiceDto, ApiResponse } from '@/types';
import { InvoiceStatus } from '@/types/invoice';
import UserProfileData from '@public/mocks/UserProfile.json';

// Simplified form values to match current InvoiceDto schema
interface NewInvoiceFormValues {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  billingAddress: string;
  country: string;
  clientCompany: string;
  issueDate: Date | null;
  status: number;
  amount: number;
  notes: string;
}

type NewInvoiceDrawerProps = Omit<DrawerProps, 'title' | 'children'> & {
  onCreate: (data: Partial<InvoiceDto>) => Promise<ApiResponse<any>>;
  onInvoiceCreated?: () => void;
};

export const NewInvoiceDrawer = ({
  onCreate,
  onInvoiceCreated,
  ...drawerProps
}: NewInvoiceDrawerProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<NewInvoiceFormValues>({
    mode: 'controlled',
    initialValues: {
      customerName: '',
      customerEmail: '',
      customerAddress: '',
      billingAddress: '',
      country: '',
      clientCompany: '',
      issueDate: new Date(),
      status: InvoiceStatus.Draft,
      amount: 0,
      notes: '',
    },
    validate: {
      customerName: isNotEmpty('Customer name cannot be empty'),
      customerEmail: (value) => {
        if (!value) return 'Customer email cannot be empty';
        return /^\S+@\S+$/.test(value) ? null : 'Invalid email format';
      },
      issueDate: isNotEmpty('Issue date is required'),
      amount: (value) => (value > 0 ? null : 'Amount must be greater than 0'),
    },
  });

  const handleSubmit = async (values: NewInvoiceFormValues) => {
    setLoading(true);
    try {
      // Map form values to Invoice DTO format
      const invoiceData: Partial<InvoiceDto> = {
        id: '',
        invoiceNumber: '',
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerAddress: values.customerAddress,
        billingAddress: values.billingAddress || undefined,
        status: Number(values.status),
        totalAmount: values.amount,
        issueDate: values.issueDate?.toISOString() || '',
        dueDate: values.issueDate?.toISOString() || '',
        notes: values.notes || undefined,
        createdById: UserProfileData.id,
      };

      // Use the onCreate mutation passed from parent (includes auto-refetch)
      const result = await onCreate(invoiceData);

      if (!result.succeeded) {
        throw new Error(result.errors?.join(', ') || 'Failed to create invoice');
      }

      notifications.show({
        title: 'Success',
        message: 'Invoice created successfully',
        color: 'green',
      });

      form.reset();

      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      if (onInvoiceCreated) {
        onInvoiceCreated();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to create invoice',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: InvoiceStatus.Draft.toString(), label: 'Draft' },
    { value: InvoiceStatus.Sent.toString(), label: 'Sent' },
    { value: InvoiceStatus.Paid.toString(), label: 'Paid' },
    { value: InvoiceStatus.PartiallyPaid.toString(), label: 'Partially Paid' },
    { value: InvoiceStatus.Overdue.toString(), label: 'Overdue' },
    { value: InvoiceStatus.Cancelled.toString(), label: 'Cancelled' },
    { value: InvoiceStatus.Refunded.toString(), label: 'Refunded' },
  ];

  return (
    <Drawer {...drawerProps} title="Create a new invoice" size="lg">
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {/* Invoice Details */}
          <Title order={4}>Invoice Details</Title>
          <Group grow>
            <DateInput
              label="Issue Date"
              placeholder="Select issue date"
              key={form.key('issueDate')}
              {...form.getInputProps('issueDate')}
              required
            />
            <Select
              label="Status"
              data={statusOptions}
              key={form.key('status')}
              {...form.getInputProps('status')}
              required
            />
          </Group>

          <NumberInput
            label="Amount"
            placeholder="0.00"
            min={0}
            decimalScale={2}
            fixedDecimalScale
            prefix="$"
            key={form.key('amount')}
            {...form.getInputProps('amount')}
            required
          />

          <Divider />

          {/* Customer Information */}
          <Title order={4}>Customer Information</Title>
          <Group grow>
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
          </Group>

          <TextInput
            label="Company (Optional)"
            placeholder="Enter company name"
            key={form.key('clientCompany')}
            {...form.getInputProps('clientCompany')}
          />

          <Group grow>
            <Textarea
              label="Customer Address"
              placeholder="Enter customer address"
              key={form.key('customerAddress')}
              {...form.getInputProps('customerAddress')}
            />
            <Textarea
              label="Billing Address"
              placeholder="Enter billing address (if different)"
              key={form.key('billingAddress')}
              {...form.getInputProps('billingAddress')}
            />
          </Group>

          <TextInput
            label="Country (Optional)"
            placeholder="Enter country"
            key={form.key('country')}
            {...form.getInputProps('country')}
          />

          <Divider />

          {/* Notes */}
          <Title order={4}>Additional Information</Title>
          <Textarea
            label="Notes"
            placeholder="Additional notes or terms"
            minRows={3}
            key={form.key('notes')}
            {...form.getInputProps('notes')}
          />

          <Button type="submit" mt="md" loading={loading}>
            Create Invoice
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};
