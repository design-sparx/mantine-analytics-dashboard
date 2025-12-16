'use client';

import { useCallback, useState } from 'react';

import {
  Anchor,
  Box,
  Button,
  Container,
  Group,
  PaperProps,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconGridDots,
  IconList,
  IconMoodEmpty,
  IconPlus,
} from '@tabler/icons-react';

import { ErrorAlert, PageHeader, Surface } from '@/components';
import { useFetch } from '@mantine/hooks';
import { PATH_DASHBOARD } from '@/routes';
import { type IApiResponse } from '@/types/api-response';
import { type InvoiceDto } from '@/types';

// Simplified API imports

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

function Invoices() {
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const {
    data: invoicesData,
    loading: invoicesLoading,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useFetch<IApiResponse<any[]>>('/api/invoices');

  const [newDrawerOpened, { open: newInvoiceOpen, close: newInvoiceClose }] =
    useDisclosure(false);

  const [editDrawerOpened, { open: editInvoiceOpen, close: editInvoiceClose }] =
    useDisclosure(false);

  const handleCreateInvoice = useCallback(async (data: Partial<InvoiceDto>) => {
    // TODO: In a real app, this would call the API to create an invoice
    // For now, just return a mock success response
    return {
      succeeded: true,
      data: null,
      errors: [],
      message: 'Invoice created successfully (mock)',
      timestamp: new Date().toISOString(),
    };
  }, []);

  const handleUpdateInvoice = useCallback(async (id: string, data: Partial<InvoiceDto>) => {
    // TODO: In a real app, this would call the API to update an invoice
    // For now, just return a mock success response
    return {
      succeeded: true,
      data: null,
      errors: [],
      message: 'Invoice updated successfully (mock)',
      timestamp: new Date().toISOString(),
    };
  }, []);

  const handleInvoiceCreated = useCallback(() => {
    // No need to manually refetch - mutations handle this automatically
  }, []);

  const handleInvoiceUpdated = useCallback(() => {
    // No need to manually refetch - mutations handle this automatically
  }, []);

  const handleEditInvoice = (invoice: InvoiceDto) => {
    setSelectedInvoice(invoice);
    editInvoiceOpen();
  };

  const handleViewInvoice = (invoice: InvoiceDto) => {
    setSelectedInvoice(invoice);
    editInvoiceOpen();
  };

  const handleDeleteInvoice = async (invoice: any) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      // In a real app, call DELETE API endpoint
      await fetch(`/api/invoices/${invoice.id}`, { method: 'DELETE' });
      refetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice. Please try again.');
    }
  };

  const invoiceItems = invoicesData?.data?.map((invoice) => (
    <InvoiceCard
      key={invoice.id}
      data={invoice}
      onEdit={handleEditInvoice}
      onView={handleViewInvoice}
    />
  ));

  console.log({ invoicesData });

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

          <Box>
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
        onInvoiceCreated={handleInvoiceCreated}
      />

      <EditInvoiceDrawer
        opened={editDrawerOpened}
        onClose={editInvoiceClose}
        onUpdate={handleUpdateInvoice}
        position="right"
        invoice={selectedInvoice}
        onInvoiceUpdated={handleInvoiceUpdated}
      />
    </>
  );
}

export default Invoices;
