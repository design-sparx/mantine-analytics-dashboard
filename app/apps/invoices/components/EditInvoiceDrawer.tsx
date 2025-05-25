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
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { useAuth } from '@/hooks/useAuth';
import {
  IInvoice,
  InvoiceStatus,
  getInvoiceStatusColor,
  getInvoiceStatusLabel,
} from '@/types/invoice';

interface EditInvoiceFormValues {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  billingAddress: string;
  status: number | string;
  taxRate: number;
  discountAmount: number;
  notes: string;
  paymentTerms: string;
}

type EditInvoiceDrawerProps = Omit<DrawerProps, 'title' | 'children'> & {
  invoice: IInvoice | null;
  onInvoiceUpdated?: () => void;
};

export const EditInvoiceDrawer = ({
  invoice,
  onInvoiceUpdated,
  ...drawerProps
}: EditInvoiceDrawerProps) => {
  const { user, accessToken, permissions } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  // Check if the user has permission to edit invoices
  const canEditInvoice = permissions?.includes('Permissions.Invoices.Edit');

  const form = useForm<EditInvoiceFormValues>({
    mode: 'controlled',
    initialValues: {
      invoiceNumber: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      billingAddress: '',
      status: InvoiceStatus.Draft.toString(),
      taxRate: 0,
      discountAmount: 0,
      notes: '',
      paymentTerms: '',
    },
    validate: {
      customerName: isNotEmpty('Customer name cannot be empty'),
      customerEmail: (value) => {
        if (!value) return 'Customer email cannot be empty';
        return /^\S+@\S+$/.test(value) ? null : 'Invalid email format';
      },
    },
  });

  const handleSubmit = async (values: EditInvoiceFormValues) => {
    if (!invoice || !isCreator || !canEditInvoice) return;

    setLoading(true);
    try {
      const payload = {
        ...values,
        status: Number(values.status),
        taxRate: values.taxRate ? Number(values.taxRate) : null,
        discountAmount: values.discountAmount
          ? Number(values.discountAmount)
          : null,
        modifiedById: user?.id,
      };

      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update invoice');
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

  const handleDelete = async () => {
    if (!invoice || !isCreator) return;

    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete invoice');
      }

      notifications.show({
        title: 'Success',
        message: 'Invoice deleted successfully',
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
          error instanceof Error ? error.message : 'Failed to delete invoice',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invoice) {
      form.setValues({
        invoiceNumber: invoice.invoiceNumber || '',
        customerName: invoice.customerName || '',
        customerEmail: invoice.customerEmail || '',
        customerPhone: invoice.customerPhone || '',
        customerAddress: invoice.customerAddress || '',
        billingAddress: invoice.billingAddress || '',
        status: invoice.status.toString() || InvoiceStatus.Draft.toString(),
        taxRate: invoice.taxRate || 0,
        discountAmount: invoice.discountAmount || 0,
        notes: invoice.notes || '',
        paymentTerms: invoice.paymentTerms || '',
      });

      // Check if the current user is the creator of the invoice
      setIsCreator(user?.id === invoice.createdById);
    }
  }, [invoice, user]);

  const statusOptions = [
    { value: InvoiceStatus.Draft.toString(), label: 'Draft' },
    { value: InvoiceStatus.Sent.toString(), label: 'Sent' },
    { value: InvoiceStatus.Refunded.toString(), label: 'Refunded' },
    { value: InvoiceStatus.PartiallyPaid.toString(), label: 'Partially Paid' },
    { value: InvoiceStatus.Paid.toString(), label: 'Paid' },
    { value: InvoiceStatus.Overdue.toString(), label: 'Overdue' },
    { value: InvoiceStatus.Cancelled.toString(), label: 'Cancelled' },
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

  const isOverdue = () => {
    if (!invoice?.dueDate) return false;
    return (
      new Date(invoice.dueDate) < new Date() &&
      invoice.status !== InvoiceStatus.Paid
    );
  };

  return (
    <Drawer {...drawerProps} title="Invoice Details" size="xl">
      <LoadingOverlay visible={loading} />

      {!isCreator && (
        <Text color="yellow" mb="md" size="sm">
          ⚠️ You can only edit invoices that you created.
        </Text>
      )}

      {invoice && (
        <Stack>
          {/* Invoice Summary */}
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={4}>
                {invoice.invoiceNumber ||
                  `INV-${invoice.id?.slice(-6)?.toUpperCase()}`}
              </Title>
              <Text size="sm" c="dimmed">
                Issued: {invoice.issueDate && formatDate(invoice.issueDate)}
              </Text>
              {invoice.dueDate && (
                <Text size="sm" c={isOverdue() ? 'red' : 'dimmed'}>
                  Due: {formatDate(invoice.dueDate)}
                </Text>
              )}
              {invoice.createdBy && (
                <Text size="sm" c="dimmed">
                  By: {invoice.createdBy.userName}
                </Text>
              )}
            </div>
            <Badge
              color={getInvoiceStatusColor(invoice.status)}
              variant="light"
              size="lg"
            >
              {getInvoiceStatusLabel(invoice.status)}
            </Badge>
          </Group>

          {isOverdue() && (
            <Text
              size="sm"
              c="red"
              fw={500}
              p="xs"
              style={{
                borderRadius: '4px',
              }}
            >
              ⚠️ This invoice is overdue
            </Text>
          )}

          {/* Invoice Items */}
          {invoice.invoiceItems && invoice.invoiceItems.length > 0 && (
            <>
              <Divider />
              <Title order={5}>Invoice Items</Title>
              <Stack gap="xs">
                {invoice.invoiceItems.map((item, index) => (
                  <Group
                    key={index}
                    justify="space-between"
                    p="sm"
                    style={{
                      backgroundColor: 'var(--mantine-color-gray-0)',
                      borderRadius: '4px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Text fw={500}>{item.description}</Text>
                      <Text size="sm" c="dimmed">
                        Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                      </Text>
                    </div>
                    <Text fw={500}>
                      {formatCurrency(
                        item.totalPrice || item.quantity * item.unitPrice,
                      )}
                    </Text>
                  </Group>
                ))}

                {/* Totals */}
                <Stack
                  gap="xs"
                  p="sm"
                  style={{
                    backgroundColor: 'var(--mantine-color-blue-0)',
                    borderRadius: '4px',
                  }}
                >
                  <Group justify="space-between">
                    <Text>Subtotal:</Text>
                    <Text>
                      {invoice.subtotal
                        ? formatCurrency(invoice.subtotal)
                        : 'N/A'}
                    </Text>
                  </Group>
                  {invoice.taxAmount && invoice.taxAmount > 0 && (
                    <Group justify="space-between">
                      <Text>Tax ({invoice.taxRate || 0}%):</Text>
                      <Text>{formatCurrency(invoice.taxAmount)}</Text>
                    </Group>
                  )}
                  {invoice.discountAmount && invoice.discountAmount > 0 && (
                    <Group justify="space-between">
                      <Text>Discount:</Text>
                      <Text>-{formatCurrency(invoice.discountAmount)}</Text>
                    </Group>
                  )}
                  <Divider />
                  <Group justify="space-between">
                    <Text fw={600} size="lg">
                      Total Amount:
                    </Text>
                    <Text fw={600} size="lg">
                      {invoice.totalAmount
                        ? formatCurrency(invoice.totalAmount)
                        : 'N/A'}
                    </Text>
                  </Group>
                </Stack>
              </Stack>
            </>
          )}

          <Divider />

          {/* Edit Form */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Title order={4}>Invoice Details</Title>
              <Group grow>
                <TextInput
                  label="Invoice Number"
                  placeholder="INV-001"
                  key={form.key('invoiceNumber')}
                  {...form.getInputProps('invoiceNumber')}
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
                label="Customer Phone"
                placeholder="Enter customer phone"
                key={form.key('customerPhone')}
                {...form.getInputProps('customerPhone')}
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
                  placeholder="Enter billing address"
                  key={form.key('billingAddress')}
                  {...form.getInputProps('billingAddress')}
                  disabled={!isCreator}
                />
              </Group>

              <Divider />

              <Title order={4}>Terms & Notes</Title>
              <Group grow>
                <NumberInput
                  label="Tax Rate (%)"
                  placeholder="0"
                  min={0}
                  max={100}
                  decimalScale={2}
                  key={form.key('taxRate')}
                  {...form.getInputProps('taxRate')}
                  disabled={!isCreator}
                />
                <NumberInput
                  label="Discount Amount"
                  placeholder="0.00"
                  min={0}
                  decimalScale={2}
                  fixedDecimalScale
                  key={form.key('discountAmount')}
                  {...form.getInputProps('discountAmount')}
                  disabled={!isCreator}
                />
              </Group>

              <Textarea
                label="Payment Terms"
                placeholder="e.g., Net 30, Due on receipt"
                key={form.key('paymentTerms')}
                {...form.getInputProps('paymentTerms')}
                disabled={!isCreator}
              />

              <Textarea
                label="Notes"
                placeholder="Additional notes or terms"
                key={form.key('notes')}
                {...form.getInputProps('notes')}
                disabled={!isCreator}
              />

              <Group justify="space-between" mt="xl">
                <Button
                  color="red"
                  onClick={handleDelete}
                  disabled={!isCreator}
                  variant="outline"
                >
                  Delete Invoice
                </Button>
                <Button type="submit" disabled={!isCreator} loading={loading}>
                  Update Invoice
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      )}
    </Drawer>
  );
};
