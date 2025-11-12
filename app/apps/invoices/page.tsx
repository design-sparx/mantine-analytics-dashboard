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
import { PermissionGate } from '@/lib/api/permissions';
import {
  type components,
  useInvoicesWithMutations,
  usePermission,
} from '@/lib/endpoints';
import { PATH_DASHBOARD } from '@/routes';

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
  const [selectedInvoice, setSelectedInvoice] = useState<
    components['schemas']['InvoiceDto'] | null
  >(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Use simplified API hooks with built-in RBAC
  const {
    data: invoicesData,
    loading: invoicesLoading,
    error: invoicesError,
    refetch: refetchInvoices,
    mutations,
    hasPermission: canViewInvoices,
    permissionDenied,
  } = useInvoicesWithMutations();

  // Permission checking for UI components
  const { hasPermission: canManageInvoices } = usePermission(
    'Permissions.Personal.Invoices',
  );

  const [newDrawerOpened, { open: newInvoiceOpen, close: newInvoiceClose }] =
    useDisclosure(false);

  const [editDrawerOpened, { open: editInvoiceOpen, close: editInvoiceClose }] =
    useDisclosure(false);

  const handleInvoiceCreated = useCallback(() => {
    // No need to manually refetch - mutations handle this automatically
  }, []);

  const handleInvoiceUpdated = useCallback(() => {
    // No need to manually refetch - mutations handle this automatically
  }, []);

  const handleEditInvoice = (invoice: components['schemas']['InvoiceDto']) => {
    setSelectedInvoice(invoice);
    editInvoiceOpen();
  };

  const handleViewInvoice = (invoice: components['schemas']['InvoiceDto']) => {
    setSelectedInvoice(invoice);
    editInvoiceOpen();
  };

  const handleDeleteInvoice = async (
    invoice: components['schemas']['InvoiceDto'],
  ) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      await mutations.delete(invoice.id!);
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
    // Show permission denied message if user doesn't have access
    if (permissionDenied) {
      return (
        <Surface p="md">
          <Stack align="center">
            <IconMoodEmpty size={24} />
            <Title order={4}>Access Denied</Title>
            <Text>
              You don&apos;t have permission to view invoices. Contact your
              administrator for access.
            </Text>
          </Stack>
        </Surface>
      );
    }

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
            {canManageInvoices && (
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
              canManageInvoices && invoicesData?.data?.length ? (
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
        onCreate={mutations.create}
        onInvoiceCreated={handleInvoiceCreated}
      />

      <EditInvoiceDrawer
        opened={editDrawerOpened}
        onClose={editInvoiceClose}
        position="right"
        invoice={selectedInvoice}
        onUpdate={mutations.update}
        onInvoiceUpdated={handleInvoiceUpdated}
      />
    </>
  );
}

export default Invoices;
