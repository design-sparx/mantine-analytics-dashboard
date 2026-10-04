'use client';

import { Container, Grid, Group, PaperProps, Stack, Text } from '@mantine/core';
import { useFetch } from '@mantine/hooks';

import {
  CategoryRevenueChart,
  OrderStatusChart,
  PageHeader,
  RevenueChart,
  StatsGrid,
  Surface,
  TopProductsTable,
} from '@/components';
import { useDashboardResource } from '@/lib/api/useDashboardResource';
import { API_ECOMMERCE } from '@/routes/api';
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
  } = useDashboardResource(API_ECOMMERCE.stats);

  const {
    data: productsData,
    error: productsError,
    loading: productsLoading,
  } = useDashboardResource(API_ECOMMERCE.products);

  const {
    data: ordersData,
    error: ordersError,
    loading: ordersLoading,
  } = useDashboardResource(API_ECOMMERCE.orders);

  const {
    data: categoriesData,
    error: categoriesError,
    loading: categoriesLoading,
  } = useDashboardResource(API_ECOMMERCE.categories);

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
            data={statsData ?? undefined}
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
                  data={ordersData ?? undefined}
                  error={ordersError}
                  loading={ordersLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <CategoryRevenueChart
                  data={categoriesData ?? undefined}
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
                  data={productsData?.slice(0, 5)}
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
