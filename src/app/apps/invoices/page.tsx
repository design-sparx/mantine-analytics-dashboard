'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Anchor,
  Box,
  Button,
  Container,
  Group,
  LoadingOverlay,
  PaperProps,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure, useFetch } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconGridDots,
  IconList,
  IconMoodEmpty,
  IconPlus,
} from '@tabler/icons-react';

import { ErrorAlert, PageHeader, Surface } from '@/components';
import { type ApiWriteError, useApiWrite } from '@/lib/hooks/useApiWrite';
import { PATH_DASHBOARD } from '@/routes';
import { API_CORE, API_WRITE } from '@/routes/api';
import { type InvoiceDto } from '@/types';
import { type IApiResponse } from '@/types/api-response';

import { EditInvoiceDrawer } from './components/EditInvoiceDrawer';
import { InvoiceCard } from './components/InvoiceCard';
import { InvoicesTable } from './components/InvoicesTable';
import { NewInvoiceDrawer } from './components/NewInvoiceDrawer';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Invoices', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const writeSucceeded = (): IApiResponse<any> => ({
  succeeded: true,
  message: 'Request succeeded',
  timestamp: new Date().toISOString(),
  data: null,
  errors: [],
});

const writeFailed = (error: ApiWriteError): IApiResponse<any> => ({
  succeeded: false,
  message: error.message,
  timestamp: new Date().toISOString(),
  data: null,
  errors: error.serverErrors.length ? error.serverErrors : [error.message],
});

/**
 * Turns a write hook into something the invoice drawers can await.
 *
 * `useApiWrite` reports a failed write as state instead of rejecting, and that
 * state only lands on the render after the request settles. So the outcome is
 * handed back through a promise the caller can await: `onSuccess` settles it
 * synchronously, and a failure settles it from the error effect. Callers still
 * receive the `IApiResponse` shape the drawers check for `succeeded`.
 */
function useInvoiceWrite<T>(
  method: 'POST' | 'PUT' | 'DELETE',
  onSuccess: () => void,
) {
  const settleRef = useRef<((outcome: IApiResponse<any>) => void) | null>(null);

  const { loading, error, refetch } = useApiWrite<T>(
    method,
    API_WRITE.invoices,
    {
      autoExecute: false,
      onSuccess: () => {
        const settle = settleRef.current;
        settleRef.current = null;
        onSuccess();
        settle?.(writeSucceeded());
      },
    },
  );

  useEffect(() => {
    if (!error) {
      return;
    }

    const settle = settleRef.current;
    settleRef.current = null;
    settle?.(writeFailed(error));
  }, [error]);

  const execute = useCallback(
    async (endpoint: string, body?: unknown): Promise<IApiResponse<any>> => {
      let settle: (outcome: IApiResponse<any>) => void = () => undefined;
      const settled = new Promise<IApiResponse<any>>((resolve) => {
        settle = resolve;
      });
      settleRef.current = settle;

      await refetch(endpoint, body);

      return settled;
    },
    [refetch],
  );

  return { execute, loading };
}

function Invoices() {
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const {
    data: invoicesData,
    loading: invoicesLoading,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useFetch<IApiResponse<any[]>>(API_CORE.invoices);

  const [newDrawerOpened, { open: newInvoiceOpen, close: newInvoiceClose }] =
    useDisclosure(false);

  const [editDrawerOpened, { open: editInvoiceOpen, close: editInvoiceClose }] =
    useDisclosure(false);

  const { execute: createInvoice, loading: createLoading } =
    useInvoiceWrite<InvoiceDto>('POST', refetchInvoices);

  const { execute: updateInvoice, loading: updateLoading } =
    useInvoiceWrite<InvoiceDto>('PUT', refetchInvoices);

  const { execute: deleteInvoice, loading: deleteLoading } = useInvoiceWrite<{
    id: string;
  }>('DELETE', refetchInvoices);

  const writing = createLoading || updateLoading || deleteLoading;

  const handleCreateInvoice = useCallback(
    (data: Partial<InvoiceDto>) => createInvoice(API_WRITE.invoices, data),
    [createInvoice],
  );

  const handleUpdateInvoice = useCallback(
    (id: string, data: Partial<InvoiceDto>) =>
      updateInvoice(API_WRITE.invoiceDetail(id), { ...data, id }),
    [updateInvoice],
  );

  const handleEditInvoice = (invoice: InvoiceDto) => {
    setSelectedInvoice(invoice);
    editInvoiceOpen();
  };

  const handleViewInvoice = (invoice: InvoiceDto) => {
    setSelectedInvoice(invoice);
    editInvoiceOpen();
  };

  const handleDeleteInvoice = useCallback(
    async (invoice: InvoiceDto) => {
      if (!invoice.id) {
        return;
      }

      if (!window.confirm('Are you sure you want to delete this invoice?')) {
        return;
      }

      const outcome = await deleteInvoice(API_WRITE.invoiceDetail(invoice.id), {
        id: invoice.id,
      });

      notifications.show({
        title: outcome.succeeded ? 'Success' : 'Error',
        message: outcome.succeeded
          ? 'Invoice deleted successfully'
          : outcome.errors.join(', '),
        color: outcome.succeeded ? 'green' : 'red',
      });
    },
    [deleteInvoice],
  );

  const invoiceItems = invoicesData?.data?.map((invoice) => (
    <InvoiceCard
      key={invoice.id}
      data={invoice}
      onEdit={handleEditInvoice}
      onView={handleViewInvoice}
    />
  ));

  const renderContent = () => {
    if (invoicesLoading) {
      return (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={`invoice-loading-${i}`}
              visible={true}
              height={220}
            />
          ))}
        </SimpleGrid>
      );
    }

    if (invoicesError || !invoicesData?.succeeded) {
      return (
        <ErrorAlert
          title="Error loading invoices"
          message={invoicesData?.errors?.join(',')}
        />
      );
    }

    if (!invoicesData?.data?.length) {
      return (
        <Surface p="md">
          <Stack align="center">
            <IconMoodEmpty size={24} />
            <Title order={4}>No invoices found</Title>
            <Text>
              You don&apos;t have any invoices yet. Create one to get started.
            </Text>
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={newInvoiceOpen}
            >
              New Invoice
            </Button>
          </Stack>
        </Surface>
      );
    }

    if (viewMode === 'table') {
      return (
        <InvoicesTable
          data={invoicesData?.data || []}
          loading={invoicesLoading}
          error={invoicesError}
          onEdit={handleEditInvoice}
          onView={handleViewInvoice}
          onDelete={handleDeleteInvoice}
        />
      );
    }

    return (
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
        {invoiceItems}
      </SimpleGrid>
    );
  };

  return (
    <>
      <>
        <title>Invoices | DesignSparx</title>
        <meta name="description" content="Manage invoices in your dashboard" />
      </>

      <Container fluid>
        <Stack gap="lg">
          <PageHeader
            title="Invoices"
            breadcrumbItems={items}
            actionButton={
              invoicesData?.data?.length ? (
                <Button
                  leftSection={<IconPlus size={18} />}
                  onClick={newInvoiceOpen}
                >
                  New Invoice
                </Button>
              ) : null
            }
          />

          <Box pos="relative">
            <LoadingOverlay visible={writing} />

            <Group justify="space-between" mb="md">
              <Group>
                <Text fz="lg" fw={600}>
                  Invoices Management
                </Text>
                <Text size="sm" c="dimmed">
                  ({invoicesData?.data?.length || 0} invoices)
                </Text>
              </Group>

              <Group>
                <SegmentedControl
                  value={viewMode}
                  onChange={(value) => setViewMode(value as 'cards' | 'table')}
                  data={[
                    { label: <IconGridDots size={16} />, value: 'cards' },
                    { label: <IconList size={16} />, value: 'table' },
                  ]}
                />
              </Group>
            </Group>

            {renderContent()}
          </Box>
        </Stack>
      </Container>

      <NewInvoiceDrawer
        opened={newDrawerOpened}
        onClose={newInvoiceClose}
        position="right"
        onCreate={handleCreateInvoice}
      />

      <EditInvoiceDrawer
        opened={editDrawerOpened}
        onClose={editInvoiceClose}
        onUpdate={handleUpdateInvoice}
        position="right"
        invoice={selectedInvoice}
      />
    </>
  );
}

export default Invoices;
