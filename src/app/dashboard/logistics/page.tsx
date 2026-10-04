'use client';

import { Container, Grid, PaperProps, Stack, Text } from '@mantine/core';
import { useFetch } from '@mantine/hooks';

import {
  ActiveShipmentsTable,
  DeliveryPerformanceChart,
  FleetStatusChart,
  PageHeader,
  RouteEfficiencyTable,
  StatsGrid,
  Surface,
  WarehouseInventoryChart,
} from '@/components';
import { useDashboardResource } from '@/lib/api/useDashboardResource';
import { API_LOGISTICS } from '@/routes/api';
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
  } = useDashboardResource(API_LOGISTICS.stats);

  const {
    data: shipmentsData,
    error: shipmentsError,
    loading: shipmentsLoading,
  } = useDashboardResource(API_LOGISTICS.shipments);

  const {
    data: fleetData,
    error: fleetError,
    loading: fleetLoading,
  } = useDashboardResource(API_LOGISTICS.fleetStatus);

  const {
    data: deliveryData,
    error: deliveryError,
    loading: deliveryLoading,
  } = useDashboardResource(API_LOGISTICS.deliveryPerformance);

  const {
    data: routeData,
    error: routeError,
    loading: routeLoading,
  } = useDashboardResource(API_LOGISTICS.routeEfficiency);

  const {
    data: warehouseData,
    error: warehouseError,
    loading: warehouseLoading,
  } = useDashboardResource(API_LOGISTICS.warehouseInventory);

  return (
    <>
      <>
        <title>Logistics Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="Logistics dashboard for shipment tracking, fleet management, delivery performance monitoring, and route optimization. Manage warehouse inventory and analyze logistics operations."
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Logistics dashboard" withActions={true} />

          <StatsGrid
            data={statsData ?? undefined}
            error={statsError}
            loading={statsLoading}
            paperProps={PAPER_PROPS}
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Delivery Performance
                </Text>
                <DeliveryPerformanceChart
                  data={deliveryData ?? undefined}
                  error={deliveryError}
                  loading={deliveryLoading}
                />
              </Surface>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Fleet Status
                </Text>
                <FleetStatusChart
                  data={fleetData ?? undefined}
                  error={fleetError}
                  loading={fleetLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Route Efficiency
                </Text>
                <RouteEfficiencyTable
                  data={routeData ?? undefined}
                  error={routeError}
                  loading={routeLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Warehouse Capacity
                </Text>
                <WarehouseInventoryChart
                  data={warehouseData ?? undefined}
                  error={warehouseError}
                  loading={warehouseLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={12}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Active Shipments
                </Text>
                <ActiveShipmentsTable
                  data={shipmentsData ?? undefined}
                  error={shipmentsError}
                  loading={shipmentsLoading}
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
