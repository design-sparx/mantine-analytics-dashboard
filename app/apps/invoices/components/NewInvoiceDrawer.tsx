'use client';

import { useState } from 'react';

import {
  ActionIcon,
  Button,
  Divider,
  Drawer,
  DrawerProps,
  Group,
  LoadingOverlay,
  NumberInput,
  Paper,
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
import { IconPlus, IconTrash } from '@tabler/icons-react';

import { useAuth } from '@/hooks/useAuth';
import { InvoiceStatus } from '@/types/invoice';
import { createInvoice, type components } from '@/lib/endpoints';

// Use the correct OpenAPI DTO type
type InvoiceDto = components['schemas']['InvoiceDto'];

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  productId?: string | null;
}

interface NewInvoiceFormValues {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  billingAddress: string;
  issueDate: Date | null;
  dueDate: Date | null;
  status: number;
  taxRate: number;
  discountAmount: number;
  notes: string;
  paymentTerms: string;
  items: InvoiceItem[]; // Changed from invoiceItems to items to match backend
}

type NewInvoiceDrawerProps = Omit<DrawerProps, 'title' | 'children'> & {
  onInvoiceCreated?: () => void;
};

export const NewInvoiceDrawer = ({
  onInvoiceCreated,
  ...drawerProps
}: NewInvoiceDrawerProps) => {
  const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<NewInvoiceFormValues>({
    mode: 'controlled',
    initialValues: {
      invoiceNumber: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      billingAddress: '',
      issueDate: new Date(),
      dueDate: null,
      status: InvoiceStatus.Draft,
      taxRate: 0,
      discountAmount: 0,
      notes: '',
      paymentTerms: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, productId: null }],
    },
    validate: {
      invoiceNumber: isNotEmpty('Invoice number cannot be empty'),
      customerName: isNotEmpty('Customer name cannot be empty'),
      customerEmail: (value) => {
        if (!value) return 'Customer email cannot be empty';
        return /^\S+@\S+$/.test(value) ? null : 'Invalid email format';
      },
      issueDate: isNotEmpty('Issue date is required'),
      dueDate: isNotEmpty('Due date is required'),
      items: {
        description: isNotEmpty('Description is required'),
        quantity: (value) =>
          value > 0 ? null : 'Quantity must be greater than 0',
        unitPrice: (value) =>
          value >= 0 ? null : 'Unit price cannot be negative',
      },
    },
  });

  const handleSubmit = async (values: NewInvoiceFormValues) => {
    setLoading(true);
    try {
      // Calculate totals
      const subtotal = values.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );
      const taxAmount = (subtotal * values.taxRate) / 100;
      const totalAmount = subtotal + taxAmount - (values.discountAmount || 0);

      const payload = {
        ...values,
        status: Number(values.status),
        subtotal,
        taxAmount,
        totalAmount,
        paidAmount: 0,
        taxRate: values.taxRate ? Number(values.taxRate) : null,
        discountAmount: values.discountAmount
          ? Number(values.discountAmount)
          : null,
        items: values.items.map((item) => ({
          ...item,
          totalPrice: item.quantity * item.unitPrice,
        })),
        createdById: user?.id,
      };

      // Map form values to OpenAPI DTO format
      const invoiceData: InvoiceDto = {
        id: undefined, // Backend will generate
        full_name: values.customerName,
        email: values.customerEmail,
        address: values.customerAddress,
        country: undefined, // Not in form
        status: Number(values.status),
        amount: totalAmount,
        issue_date: values.issueDate?.toISOString(),
        description: values.notes,
        client_email: values.customerEmail,
        client_address: values.billingAddress,
        client_country: undefined, // Not in form
        client_name: values.customerName,
        client_company: undefined, // Not in form
        created_by_id: user?.id,
        created_by_email: user?.email,
        created_by_name: user?.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = await createInvoice(invoiceData);

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

  const addInvoiceItem = () => {
    form.insertListItem('items', {
      description: '',
      quantity: 1,
      unitPrice: 0,
      productId: null,
    });
  };

  const removeInvoiceItem = (index: number) => {
    form.removeListItem('items', index);
  };

  const statusOptions = [
    { value: InvoiceStatus.Draft.toString(), label: 'Draft' },
    { value: InvoiceStatus.Sent.toString(), label: 'Sent' },
    { value: InvoiceStatus.Paid.toString(), label: 'Paid' },
  ];

  // Calculate live totals
  const subtotal = form.values.items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0,
  );
  const taxAmount = (subtotal * (form.values.taxRate || 0)) / 100;
  const totalAmount = subtotal + taxAmount - (form.values.discountAmount || 0);

  return (
    <Drawer {...drawerProps} title="Create a new invoice" size="xl">
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {/* Invoice Details */}
          <Title order={4}>Invoice Details</Title>
          <Group grow>
            <TextInput
              label="Invoice Number"
              placeholder="INV-001"
              key={form.key('invoiceNumber')}
              {...form.getInputProps('invoiceNumber')}
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

          <Group grow>
            <DateInput
              label="Issue Date"
              placeholder="Select issue date"
              key={form.key('issueDate')}
              {...form.getInputProps('issueDate')}
              required
            />
            <DateInput
              label="Due Date"
              placeholder="Select due date"
              key={form.key('dueDate')}
              {...form.getInputProps('dueDate')}
              required
            />
          </Group>

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
            label="Customer Phone"
            placeholder="Enter customer phone"
            key={form.key('customerPhone')}
            {...form.getInputProps('customerPhone')}
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

          <Divider />

          {/* Invoice Items */}
          <Group justify="space-between">
            <Title order={4}>Invoice Items</Title>
            <Button
              variant="light"
              size="xs"
              leftSection={<IconPlus size={14} />}
              onClick={addInvoiceItem}
            >
              Add Item
            </Button>
          </Group>

          {form.values.items.map((item, index) => (
            <Group key={index} align="flex-end">
              <TextInput
                label="Description"
                placeholder="Item description"
                style={{ flex: 2 }}
                {...form.getInputProps(`items.${index}.description`)}
                required
              />
              <NumberInput
                label="Quantity"
                placeholder="Qty"
                min={1}
                style={{ width: 80 }}
                {...form.getInputProps(`items.${index}.quantity`)}
                required
              />
              <NumberInput
                label="Unit Price"
                placeholder="0.00"
                min={0}
                decimalScale={2}
                fixedDecimalScale
                style={{ width: 120 }}
                {...form.getInputProps(`items.${index}.unitPrice`)}
                required
              />
              <Text size="sm" style={{ width: 80, textAlign: 'right' }}>
                ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
              </Text>
              {form.values.items.length > 1 && (
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => removeInvoiceItem(index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              )}
            </Group>
          ))}

          <Divider />

          {/* Totals and Terms */}
          <Title order={4}>Totals & Terms</Title>
          <Group grow>
            <NumberInput
              label="Tax Rate (%)"
              placeholder="0"
              min={0}
              max={100}
              decimalScale={2}
              {...form.getInputProps('taxRate')}
            />
            <NumberInput
              label="Discount Amount"
              placeholder="0.00"
              min={0}
              decimalScale={2}
              fixedDecimalScale
              {...form.getInputProps('discountAmount')}
            />
          </Group>

          {/* Live Total Calculation */}
          <Paper p="md" withBorder>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text>Subtotal:</Text>
                <Text>${subtotal.toFixed(2)}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Tax ({form.values.taxRate || 0}%):</Text>
                <Text>${taxAmount.toFixed(2)}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Discount:</Text>
                <Text>-${(form.values.discountAmount || 0).toFixed(2)}</Text>
              </Group>
              <Divider />
              <Group justify="space-between">
                <Text fw={600} size="lg">
                  Total:
                </Text>
                <Text fw={600} size="lg">
                  ${totalAmount.toFixed(2)}
                </Text>
              </Group>
            </Stack>
          </Paper>

          <Textarea
            label="Payment Terms"
            placeholder="e.g., Net 30, Due on receipt"
            key={form.key('paymentTerms')}
            {...form.getInputProps('paymentTerms')}
          />

          <Textarea
            label="Notes"
            placeholder="Additional notes or terms"
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
