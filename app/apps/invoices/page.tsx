'use client';

import { useCallback, useState } from 'react';

import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PaperProps,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure, useFetch } from '@mantine/hooks';
import {
  IconGridDots,
  IconList,
  IconMoodEmpty,
  IconPlus,
} from '@tabler/icons-react';

import { ErrorAlert, PageHeader, Surface } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { PATH_DASHBOARD } from '@/routes';
import { IApiResponse } from '@/types/api-response';
import { IInvoice } from '@/types/invoice';

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

const PAPER_PROPS: PaperProps = {
  p: 'md',
};

function Invoices() {
  const { permissions, accessToken } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const {
    data: invoicesData,
    loading: invoicesLoading,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useFetch<IApiResponse<IInvoice[]>>('/api/invoices', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
  });

  // Check if the user has permission to add invoices
  const canAddInvoice = permissions?.includes('Permissions.Invoices.Create');

  const [newDrawerOpened, { open: newInvoiceOpen, close: newInvoiceClose }] =
    useDisclosure(false);

  const [editDrawerOpened, { open: editInvoiceOpen, close: editInvoiceClose }] =
    useDisclosure(false);

  const handleInvoiceCreated = useCallback(() => {
    refetchInvoices();
  }, [refetchInvoices]);

  const handleInvoiceUpdated = useCallback(() => {
    refetchInvoices();
  }, [refetchInvoices]);

  const handleEditInvoice = (invoice: IInvoice) => {
    setSelectedInvoice(invoice);
    editInvoiceOpen();
  };

  const handleViewInvoice = (invoice: IInvoice) => {
    setSelectedInvoice(invoice);
    editInvoiceOpen();
  };

  const handleDeleteInvoice = async (invoice: IInvoice) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        refetchInvoices();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice. Please try again.');
    }
  };

  const invoiceItems = invoicesData?.data?.map((invoice: IInvoice) => (
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
        <Surface component={Paper} p="md">
          <Stack align="center">
            <IconMoodEmpty size={24} />
            <Title order={4}>No invoices found</Title>
            <Text>
              You don&apos;t have any invoices yet. Create one to get started.
            </Text>
            {canAddInvoice && (
              <Button
                leftSection={<IconPlus size={18} />}
                onClick={newInvoiceOpen}
              >
                New Invoice
              </Button>
            )}
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
              canAddInvoice && (
                <Button
                  leftSection={<IconPlus size={18} />}
                  onClick={newInvoiceOpen}
                >
                  New Invoice
                </Button>
              )
            }
          />

          <Paper {...PAPER_PROPS}>
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
          </Paper>
        </Stack>
      </Container>

      <NewInvoiceDrawer
        opened={newDrawerOpened}
        onClose={newInvoiceClose}
        position="right"
        onInvoiceCreated={handleInvoiceCreated}
      />

      <EditInvoiceDrawer
        opened={editDrawerOpened}
        onClose={editInvoiceClose}
        position="right"
        invoice={selectedInvoice}
        onInvoiceUpdated={handleInvoiceUpdated}
      />
    </>
  );
}

export default Invoices;
