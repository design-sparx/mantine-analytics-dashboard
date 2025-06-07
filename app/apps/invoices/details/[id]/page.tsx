'use client';

import { useEffect, useState } from 'react';

import {
  Anchor,
  Badge,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  PaperProps,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useFetch } from '@mantine/hooks';
import { IconDownload, IconEdit, IconPrinter } from '@tabler/icons-react';

import { PageHeader } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { PATH_DASHBOARD } from '@/routes';
import { IApiResponse } from '@/types/api-response';
import {
  IInvoice,
  getInvoiceStatusColor,
  getInvoiceStatusLabel,
} from '@/types/invoice';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

interface InvoiceDetailsProps {
  params: { id: string };
}

function InvoiceDetails({ params }: InvoiceDetailsProps) {
  const { accessToken, user } = useAuth();
  const [invoice, setInvoice] = useState<IInvoice | null>(null);

  const {
    data: invoiceData,
    loading: invoiceLoading,
    error: invoiceError,
  } = useFetch<IApiResponse<IInvoice>>(`/api/invoices/${params.id}`, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    if (invoiceData?.succeeded && invoiceData.data) {
      setInvoice(invoiceData.data);
    }
  }, [invoiceData]);

  const items = [
    { title: 'Dashboard', href: PATH_DASHBOARD.default },
    { title: 'Invoices', href: '/apps/invoices' },
    { title: 'Details', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!invoice?.dueDate) return false;
    return new Date(invoice.dueDate) < new Date() && invoice.status !== 5; // Not paid
  };

  const isCreator = user?.id === invoice?.createdById;

  if (invoiceLoading) {
    return (
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Loading..." breadcrumbItems={items} />
          <Text>Loading invoice details...</Text>
        </Stack>
      </Container>
    );
  }

  if (invoiceError || !invoice) {
    return (
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Invoice Not Found" breadcrumbItems={items} />
          <Text color="red">Failed to load invoice details.</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <title>
        Invoice -{' '}
        {invoice.invoiceNumber || invoice.id?.slice(-6)?.toUpperCase()} |
        DesignSparx
      </title>
      <meta
        name="description"
        content="View detailed invoice information and manage invoice status."
      />

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title={`Invoice ${
              invoice.invoiceNumber ||
              `#${invoice.id?.slice(-6)?.toUpperCase()}`
            }`}
            breadcrumbItems={items}
            actionButton={
              <Group>
                <Button
                  variant="outline"
                  leftSection={<IconPrinter size={16} />}
                >
                  Print
                </Button>
                <Button
                  variant="outline"
                  leftSection={<IconDownload size={16} />}
                >
                  Download PDF
                </Button>
                {isCreator && (
                  <Button leftSection={<IconEdit size={16} />}>
                    Edit Invoice
                  </Button>
                )}
              </Group>
            }
          />

          <Paper {...PAPER_PROPS}>
            {/* Invoice Header */}
            <Group justify="space-between" mb="xl">
              <div>
                <Title order={2}>
                  {invoice.invoiceNumber ||
                    `INV-${invoice.id?.slice(-6)?.toUpperCase()}`}
                </Title>
                <Text size="sm" c="dimmed">
                  Invoice ID: {invoice.id}
                </Text>
              </div>
              <Badge
                size="lg"
                color={getInvoiceStatusColor(invoice.status)}
                variant="light"
              >
                {getInvoiceStatusLabel(invoice.status)}
              </Badge>
            </Group>

            {isOverdue() && (
              <Paper
                p="md"
                mb="xl"
                style={{
                  backgroundColor: 'var(--mantine-color-red-0)',
                  border: '1px solid var(--mantine-color-red-3)',
                }}
              >
                <Text c="red" fw={500}>
                  ⚠️ This invoice is overdue. Payment was due on{' '}
                  {formatDate(invoice.dueDate!)}
                </Text>
              </Paper>
            )}

            {/* Invoice Details Grid */}
            <Grid mb="xl">
              <Grid.Col span={6}>
                <Stack gap="md">
                  <div>
                    <Title order={4} mb="xs">
                      Bill To:
                    </Title>
                    <Text fw={500}>{invoice.customerName}</Text>
                    {invoice.customerEmail && (
                      <Text size="sm">{invoice.customerEmail}</Text>
                    )}
                    {invoice.customerPhone && (
                      <Text size="sm">{invoice.customerPhone}</Text>
                    )}
                    {invoice.customerAddress && (
                      <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                        {invoice.customerAddress}
                      </Text>
                    )}
                  </div>

                  {invoice.billingAddress &&
                    invoice.billingAddress !== invoice.customerAddress && (
                      <div>
                        <Title order={5} mb="xs">
                          Billing Address:
                        </Title>
                        <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                          {invoice.billingAddress}
                        </Text>
                      </div>
                    )}
                </Stack>
              </Grid.Col>

              <Grid.Col span={6}>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text>Issue Date:</Text>
                    <Text fw={500}>
                      {invoice.issueDate
                        ? formatDate(invoice.issueDate)
                        : 'N/A'}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Due Date:</Text>
                    <Text fw={500} c={isOverdue() ? 'red' : undefined}>
                      {invoice.dueDate ? formatDate(invoice.dueDate) : 'N/A'}
                    </Text>
                  </Group>
                  {invoice.paymentTerms && (
                    <Group justify="space-between">
                      <Text>Payment Terms:</Text>
                      <Text fw={500}>{invoice.paymentTerms}</Text>
                    </Group>
                  )}
                  {invoice.createdBy && (
                    <Group justify="space-between">
                      <Text>Created By:</Text>
                      <Text fw={500}>{invoice.createdBy.userName}</Text>
                    </Group>
                  )}
                </Stack>
              </Grid.Col>
            </Grid>

            <Divider mb="xl" />

            {/* Invoice Items */}
            <Title order={4} mb="md">
              Invoice Items
            </Title>
            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Description</Table.Th>
                  <Table.Th style={{ textAlign: 'center' }}>Quantity</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Unit Price</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Total</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {invoice.invoiceItems?.map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <Text fw={500}>{item.description}</Text>
                      {item.product && (
                        <Text size="sm" c="dimmed">
                          SKU: {item.product.sku || 'N/A'}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center' }}>
                      {item.quantity}
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>
                      {formatCurrency(item.unitPrice)}
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>
                      <Text fw={500}>
                        {formatCurrency(
                          item.totalPrice || item.quantity * item.unitPrice,
                        )}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {/* Invoice Totals */}
            <Stack
              gap="xs"
              mt="xl"
              style={{ maxWidth: '300px', marginLeft: 'auto' }}
            >
              <Group justify="space-between">
                <Text>Subtotal:</Text>
                <Text fw={500}>
                  {invoice.subtotal ? formatCurrency(invoice.subtotal) : 'N/A'}
                </Text>
              </Group>

              {invoice.taxAmount && invoice.taxAmount > 0 && (
                <Group justify="space-between">
                  <Text>Tax ({invoice.taxRate || 0}%):</Text>
                  <Text fw={500}>{formatCurrency(invoice.taxAmount)}</Text>
                </Group>
              )}

              {invoice.discountAmount && invoice.discountAmount > 0 && (
                <Group justify="space-between">
                  <Text>Discount:</Text>
                  <Text fw={500} c="red">
                    -{formatCurrency(invoice.discountAmount)}
                  </Text>
                </Group>
              )}

              <Divider />

              <Group justify="space-between">
                <Text size="lg" fw={700}>
                  Total Amount:
                </Text>
                <Text size="lg" fw={700}>
                  {invoice.totalAmount
                    ? formatCurrency(invoice.totalAmount)
                    : 'N/A'}
                </Text>
              </Group>
            </Stack>

            {/* Notes */}
            {invoice.notes && (
              <>
                <Divider my="xl" />
                <div>
                  <Title order={4} mb="md">
                    Notes
                  </Title>
                  <Text style={{ whiteSpace: 'pre-line' }}>
                    {invoice.notes}
                  </Text>
                </div>
              </>
            )}
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default InvoiceDetails;
