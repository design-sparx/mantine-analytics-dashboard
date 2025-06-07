'use client';

import { useCallback, useState } from 'react';

import {
  Anchor,
  Button,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure, useFetch } from '@mantine/hooks';
import { IconMoodEmpty, IconPlus } from '@tabler/icons-react';

import { ErrorAlert, PageHeader, Surface } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { PATH_DASHBOARD } from '@/routes';
import { IApiResponse } from '@/types/api-response';
import { IOrder } from '@/types/order';

import { EditOrderDrawer } from './components/EditOrderDrawer';
import { NewOrderDrawer } from './components/NewOrderDrawer';
import { OrderCard } from './components/OrderCard';

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
  const { permissions, accessToken } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useFetch<IApiResponse<IOrder[]>>('/api/orders', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });

  // Check if the user has permission to add orders
  const canAddOrder = permissions?.includes('Permissions.Orders.Create');

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

  const handleEditOrder = (order: IOrder) => {
    setSelectedOrder(order);
    editOrderOpen();
  };

  const handleViewOrder = (order: IOrder) => {
    setSelectedOrder(order);
    editOrderOpen();
  };

  const orderItems = ordersData?.data?.map((order: IOrder) => (
    <OrderCard
      key={order.id}
      data={order}
      onEdit={handleEditOrder}
      onView={handleViewOrder}
    />
  ));

  const renderContent = () => {
    if (ordersLoading) {
      return (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={`order-loading-${i}`} visible={true} height={200} />
          ))}
        </SimpleGrid>
      );
    }

    if (ordersError || !ordersData?.succeeded) {
      return (
        <ErrorAlert
          title="Error loading orders"
          message={ordersData?.errors?.join(',')}
        />
      );
    }

    if (!ordersData?.data?.length) {
      return (
        <Surface p="md">
          <Stack align="center">
            <IconMoodEmpty size={24} />
            <Title order={4}>No orders found</Title>
            <Text>
              You don&apos;t have any orders yet. Create one to get started.
            </Text>
            {canAddOrder && (
              <Button
                leftSection={<IconPlus size={18} />}
                onClick={newOrderOpen}
              >
                New Order
              </Button>
            )}
          </Stack>
        </Surface>
      );
    }

    return (
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
        {orderItems}
      </SimpleGrid>
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
          canAddOrder &&
          ordersData?.data?.length && (
            <Button leftSection={<IconPlus size={18} />} onClick={newOrderOpen}>
              New Order
            </Button>
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
