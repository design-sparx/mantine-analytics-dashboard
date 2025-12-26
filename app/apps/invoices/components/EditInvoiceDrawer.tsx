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
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';


import type { InvoiceDto, ApiResponse } from '@/types';
import {
  InvoiceStatus,
  getInvoiceStatusColor,
  getInvoiceStatusLabel,
} from '@/types/invoice';

// Simplified form values to match current InvoiceDto schema
interface EditInvoiceFormValues {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  billingAddress: string;
  country: string;
  clientCompany: string;
  issueDate: Date | null;
  status: number | string;
  amount: number;
  notes: string;
}

type EditInvoiceDrawerProps = Omit<DrawerProps, 'title' | 'children'> & {
  invoice: InvoiceDto | null;
  onUpdate: (id: string, data: Partial<InvoiceDto>) => Promise<ApiResponse<any>>;
  onInvoiceUpdated?: () => void;
};

export const EditInvoiceDrawer = ({
  invoice,
  onUpdate,
  onInvoiceUpdated,
  ...drawerProps
}: EditInvoiceDrawerProps) => {
  const [loading, setLoading] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  const form = useForm<EditInvoiceFormValues>({
    mode: 'controlled',
    initialValues: {
      customerName: '',
      customerEmail: '',
      customerAddress: '',
      billingAddress: '',
      country: '',
      clientCompany: '',
      issueDate: new Date(),
      status: InvoiceStatus.Draft.toString(),
      amount: 0,
      notes: '',
    },
    validate: {
      customerName: isNotEmpty('Customer name cannot be empty'),
      customerEmail: (value) => {
        if (!value) return 'Customer email cannot be empty';
        return /^\S+@\S+$/.test(value) ? null : 'Invalid email format';
      },
      amount: (value) => (value > 0 ? null : 'Amount must be greater than 0'),
    },
  });

  const handleSubmit = async (values: EditInvoiceFormValues) => {
    if (!invoice || !isCreator) return;

    setLoading(true);
    try {
      // Map form values to Invoice DTO format (only send changed fields)
      const invoiceData: Partial<InvoiceDto> = {
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerAddress: values.customerAddress,
        billingAddress: values.billingAddress || undefined,
        status: Number(values.status),
        totalAmount: values.amount,
        issueDate: values.issueDate?.toISOString(),
        notes: values.notes || undefined,
      };

      // Use the onUpdate mutation passed from parent (includes auto-refetch)
      const result = await onUpdate(invoice.id!, invoiceData);

      if (!result.succeeded) {
        throw new Error(result.errors?.join(', ') || 'Failed to update invoice');
      }

      notifications.show({
        title: 'Success',
        message: 'Invoice updated successfully',
        color: 'green',
      });

      if (drawerProps.onClose) {
        drawerProps.onClose();
      }

      if (onInvoiceUpdated) {
        onInvoiceUpdated();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to update invoice',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invoice) {
      form.setValues({
        customerName: invoice.customerName || '',
        customerEmail: invoice.customerEmail || '',
        customerAddress: invoice.customerAddress || '',
        billingAddress: invoice.billingAddress || '',
        country: '',
        clientCompany: '',
        issueDate: invoice.issueDate ? new Date(invoice.issueDate) : new Date(),
        status: invoice.status?.toString() || InvoiceStatus.Draft.toString(),
        amount: invoice.totalAmount || 0,
        notes: invoice.notes || '',
      });

      // Check if the current user is the creator of the invoice
      setIsCreator(true); // Auth removed - all users can edit for demo purposes
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice]);

  const statusOptions = [
    { value: InvoiceStatus.Draft.toString(), label: 'Draft' },
    { value: InvoiceStatus.Sent.toString(), label: 'Sent' },
    { value: InvoiceStatus.Paid.toString(), label: 'Paid' },
    { value: InvoiceStatus.PartiallyPaid.toString(), label: 'Partially Paid' },
    { value: InvoiceStatus.Overdue.toString(), label: 'Overdue' },
    { value: InvoiceStatus.Cancelled.toString(), label: 'Cancelled' },
    { value: InvoiceStatus.Refunded.toString(), label: 'Refunded' },
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

  return (
    <Drawer {...drawerProps} title="Invoice Details" size="lg">
      <LoadingOverlay visible={loading} />

      {!isCreator && (
        <Text c="yellow" mb="md" size="sm">
          ⚠️ You can only edit invoices that you created.
        </Text>
      )}

      {invoice && (
        <Stack>
          {/* Invoice Summary */}
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={4}>
                {`INV-${invoice.id?.slice(-6)?.toUpperCase()}`}
              </Title>
              <Text size="sm" c="dimmed">
                Issued: {invoice.issueDate && formatDate(invoice.issueDate)}
              </Text>
              {invoice.createdBy && (
                <Text size="sm" c="dimmed">
                  By: {invoice.createdBy}
                </Text>
              )}
            </div>
            <Badge
              color={getInvoiceStatusColor(invoice.status!)}
              variant="light"
              size="lg"
            >
              {getInvoiceStatusLabel(invoice.status!)}
            </Badge>
          </Group>

          {/* Amount Display */}
          <Group justify="space-between" p="md" style={{ backgroundColor: 'var(--mantine-color-blue-0)', borderRadius: '8px' }}>
            <Text fw={600} size="lg">
              Total Amount:
            </Text>
            <Text fw={600} size="lg">
              {invoice.totalAmount ? formatCurrency(invoice.totalAmount) : 'N/A'}
            </Text>
          </Group>

          <Divider />

          {/* Edit Form */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Title order={4}>Invoice Details</Title>
              <Group grow>
                <DateInput
                  label="Issue Date"
                  placeholder="Select issue date"
                  key={form.key('issueDate')}
                  {...form.getInputProps('issueDate')}
                  required
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
                disabled={!isCreator}
              />

              <Divider />

              <Title order={4}>Customer Information</Title>
              <Group grow>
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
              </Group>

              <TextInput
                label="Company (Optional)"
                placeholder="Enter company name"
                key={form.key('clientCompany')}
                {...form.getInputProps('clientCompany')}
                disabled={!isCreator}
              />

              <Group grow>
                <Textarea
                  label="Customer Address"
                  placeholder="Enter customer address"
                  key={form.key('customerAddress')}
                  {...form.getInputProps('customerAddress')}
                  disabled={!isCreator}
                />
                <Textarea
                  label="Billing Address"
                  placeholder="Enter billing address (if different)"
                  key={form.key('billingAddress')}
                  {...form.getInputProps('billingAddress')}
                  disabled={!isCreator}
                />
              </Group>

              <TextInput
                label="Country (Optional)"
                placeholder="Enter country"
                key={form.key('country')}
                {...form.getInputProps('country')}
                disabled={!isCreator}
              />

              <Divider />

              <Title order={4}>Additional Information</Title>
              <Textarea
                label="Notes"
                placeholder="Additional notes or terms"
                minRows={3}
                key={form.key('notes')}
                {...form.getInputProps('notes')}
                disabled={!isCreator}
              />

              <Button type="submit" disabled={!isCreator} loading={loading} mt="md">
                Update Invoice
              </Button>
            </Stack>
          </form>
        </Stack>
      )}
    </Drawer>
  );
};
