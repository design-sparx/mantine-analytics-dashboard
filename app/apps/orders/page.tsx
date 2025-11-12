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

import { ErrorAlert, OrdersTable, PageHeader, Surface } from '@/components';
import { type components, useOrdersWithMutations } from '@/lib/endpoints';
import { PATH_DASHBOARD } from '@/routes';

import { EditOrderDrawer } from './components/EditOrderDrawer';
import { NewOrderDrawer } from './components/NewOrderDrawer';
import { OrderCard } from './components/OrderCard';

type OrderDto = components['schemas']['OrderDto'];

type ViewMode = 'grid' | 'table';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Apps', href: '#' },
  { title: 'Orders', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useOrdersWithMutations();

  const [newDrawerOpened, { open: newOrderOpen, close: newOrderClose }] =
    useDisclosure(false);

  const [editDrawerOpened, { open: editOrderOpen, close: editOrderClose }] =
    useDisclosure(false);

  const handleOrderCreated = useCallback(() => {
    refetchOrders();
  }, [refetchOrders]);

  const handleOrderUpdated = useCallback(() => {
    refetchOrders();
  }, [refetchOrders]);

  const handleEditOrder = (order: OrderDto) => {
    setSelectedOrder(order);
    editOrderOpen();
  };

  const handleViewOrder = (order: OrderDto) => {
    setSelectedOrder(order);
    editOrderOpen();
  };

  const orderItems = ordersData?.data?.map((order: OrderDto) => (
    <OrderCard
      key={order.id}
      data={order}
      onEdit={handleEditOrder}
      onView={handleViewOrder}
    />
  ));

  const renderContent = () => {
    if (ordersLoading) {
      return viewMode === 'grid' ? (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={`order-loading-${i}`} visible={true} height={200} />
          ))}
        </SimpleGrid>
      ) : (
        <Surface>
          <OrdersTable
            data={[]}
            loading={true}
            onEdit={handleEditOrder}
            onView={handleViewOrder}
          />
        </Surface>
      );
    }

    if (ordersError) {
      return (
        <ErrorAlert
          title="Error loading orders"
          message={ordersError?.message || 'Failed to load orders'}
        />
      );
    }

    if (!ordersData?.data.length) {
      return (
        <Surface p="md">
          <Stack align="center">
            <IconMoodEmpty size={24} />
            <Title order={4}>No orders found</Title>
            <Text>
              You don&apos;t have any orders yet. Create one to get started.
            </Text>
            <Button leftSection={<IconPlus size={18} />} onClick={newOrderOpen}>
              New Order
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
      >
        {orderItems}
      </SimpleGrid>
    ) : (
      <Surface>
        <OrdersTable
          data={ordersData.data}
          loading={false}
          onEdit={handleEditOrder}
          onView={handleViewOrder}
        />
      </Surface>
    );
  };

  return (
    <>
      <>
        <title>Orders | DesignSparx</title>
        <meta name="description" content="Manage orders in your dashboard" />
      </>
      <PageHeader
        title="Orders"
        breadcrumbItems={items}
        actionButton={
          ordersData?.data &&
          ordersData.data?.length > 0 && (
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
                onClick={newOrderOpen}
              >
                New Order
              </Button>
            </Group>
          )
        }
      />

      {renderContent()}

      <NewOrderDrawer
        opened={newDrawerOpened}
        onClose={newOrderClose}
        position="right"
        onOrderCreated={handleOrderCreated}
      />

      <EditOrderDrawer
        opened={editDrawerOpened}
        onClose={editOrderClose}
        position="right"
        order={selectedOrder}
        onOrderUpdated={handleOrderUpdated}
      />
    </>
  );
}

export default Orders;
