'use client';

import {
  Container,
  Grid,
  PaperProps,
  Stack,
  Text,
  Group,
} from '@mantine/core';

import {
  PageHeader,
  StatsGrid,
  Surface,
  TopProductsTable,
  OrderStatusChart,
  CategoryRevenueChart,
  RevenueChart,
} from '@/components';
import { useFetch } from '@mantine/hooks';
import { IApiResponse } from '@/types/api-response';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  style: { minHeight: '100%' },
};

function Page() {
  const {
    data: statsData,
    error: statsError,
    loading: statsLoading,
  } = useFetch<IApiResponse<any[]>>('/api/ecommerce/stats');

  const {
    data: productsData,
    error: productsError,
    loading: productsLoading,
  } = useFetch<IApiResponse<any[]>>('/api/ecommerce/products');

  const {
    data: ordersData,
    error: ordersError,
    loading: ordersLoading,
  } = useFetch<IApiResponse<any[]>>('/api/ecommerce/orders');

  const {
    data: categoriesData,
    error: categoriesError,
    loading: categoriesLoading,
  } = useFetch<IApiResponse<any[]>>('/api/ecommerce/categories');

  return (
    <>
      <>
        <title>E-commerce Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="E-commerce dashboard for online store metrics, sales analytics, inventory management, and order tracking. Monitor revenue, conversion rates, and product performance."
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="E-commerce dashboard" withActions={true} />

          <StatsGrid
            data={statsData?.data || []}
            error={statsError}
            loading={statsLoading}
            paperProps={PAPER_PROPS}
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <RevenueChart {...PAPER_PROPS} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Order Status
                </Text>
                <OrderStatusChart
                  data={ordersData?.data || []}
                  error={ordersError}
                  loading={ordersLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <CategoryRevenueChart
                  data={categoriesData?.data || []}
                  error={categoriesError}
                  loading={categoriesLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={600}>
                    Top Products
                  </Text>
                </Group>
                <TopProductsTable
                  data={productsData?.data?.slice(0, 5) || []}
                  error={productsError}
                  loading={productsLoading}
                />
              </Surface>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default Page;
