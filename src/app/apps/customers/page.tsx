'use client';

import { useCallback, useState } from 'react';

import {
  Anchor,
  Button,
  Group,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLayoutGrid,
  IconList,
  IconMoodEmpty,
  IconPlus,
} from '@tabler/icons-react';

import { CustomersTable, ErrorAlert, PageHeader, Surface } from '@/components';
import type { CustomerDto } from '@/types';
import { useCustomers } from '@/lib/hooks/useApi';
import { PATH_DASHBOARD } from '@/routes';

import { EditCustomerDrawer } from './components/EditCustomerDrawer';
import { NewCustomerDrawer } from './components/NewCustomerDrawer';
import { CustomerCard } from './components/CustomerCard';

type ViewMode = 'grid' | 'table';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Customers', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const {
    data: customersData,
    loading: customersLoading,
    error: customersError,
    refetch: refetchCustomers,
  } = useCustomers();

  const [newDrawerOpened, { open: newCustomerOpen, close: newCustomerClose }] =
    useDisclosure(false);

  const [editDrawerOpened, { open: editCustomerOpen, close: editCustomerClose }] =
    useDisclosure(false);

  const handleCustomerCreated = useCallback(() => {
    refetchCustomers();
  }, [refetchCustomers]);

  const handleCustomerUpdated = useCallback(() => {
    refetchCustomers();
  }, [refetchCustomers]);

  const handleEditCustomer = (customer: CustomerDto) => {
    setSelectedCustomer(customer);
    editCustomerOpen();
  };

  const handleViewCustomer = (customer: CustomerDto) => {
    setSelectedCustomer(customer);
    editCustomerOpen();
  };

  const customerItems = customersData?.data?.map((customer: CustomerDto) => (
    <CustomerCard
      key={customer.id}
      data={customer}
      onEdit={handleEditCustomer}
      onView={handleViewCustomer}
    />
  ));

  const renderContent = () => {
    if (customersLoading) {
      return viewMode === 'grid' ? (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={`customer-loading-${i}`} visible={true} height={200} />
          ))}
        </SimpleGrid>
      ) : (
        <Surface>
          <CustomersTable
            data={[]}
            loading={true}
            onEdit={handleEditCustomer}
            onView={handleViewCustomer}
          />
        </Surface>
      );
    }

    if (customersError) {
      return (
        <ErrorAlert
          title="Error loading customers"
          message={customersError?.message || 'Failed to load customers'}
        />
      );
    }

    if (!customersData?.data?.length) {
      return (
        <Surface p="md">
          <Stack align="center">
            <IconMoodEmpty size={24} />
            <Title order={4}>No customers found</Title>
            <Text>
              You don&apos;t have any customers yet. Create one to get started.
            </Text>
            <Button leftSection={<IconPlus size={18} />} onClick={newCustomerOpen}>
              New Customer
            </Button>
          </Stack>
        </Surface>
      );
    }

    return viewMode === 'grid' ? (
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
        mt="md"
      >
        {customerItems}
      </SimpleGrid>
    ) : (
      <Surface mt="md">
        <CustomersTable
          data={customersData.data}
          loading={false}
          onEdit={handleEditCustomer}
          onView={handleViewCustomer}
        />
      </Surface>
    );
  };

  return (
    <>
      <>
        <title>Customers | DesignSparx</title>
        <meta name="description" content="Manage customers in your dashboard" />
      </>
      <PageHeader
        title="Customers"
        breadcrumbItems={items}
        actionButton={
          customersData?.data &&
          customersData.data?.length > 0 && (
            <Group gap="sm">
              <SegmentedControl
                value={viewMode}
                onChange={(value) => setViewMode(value as ViewMode)}
                data={[
                  {
                    value: 'grid',
                    label: <IconLayoutGrid size={16} />,
                  },
                  {
                    value: 'table',
                    label: <IconList size={16} />,
                  },
                ]}
              />
              <Button
                leftSection={<IconPlus size={18} />}
                onClick={newCustomerOpen}
              >
                New Customer
              </Button>
            </Group>
          )
        }
      />

      {renderContent()}

      <NewCustomerDrawer
        opened={newDrawerOpened}
        onClose={newCustomerClose}
        position="right"
        onCustomerCreated={handleCustomerCreated}
      />

      <EditCustomerDrawer
        opened={editDrawerOpened}
        onClose={editCustomerClose}
        position="right"
        customer={selectedCustomer}
        onCustomerUpdated={handleCustomerUpdated}
      />
    </>
  );
}

export default Customers;
