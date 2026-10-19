'use client';

import { Container, Grid, PaperProps, Stack } from '@mantine/core';

import {
  DashboardSection,
  LocationAnalyticsTable,
  PageHeader,
  PriceDistributionChart,
  PropertyListingsTable,
  PropertyTypesChart,
  SalesTrendsChart,
  StatsGrid,
} from '@/components';
import { useDashboardResource } from '@/lib/api/useDashboardResource';
import { API_REAL_ESTATE } from '@/routes/api';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  style: { minHeight: '100%' },
};

export function RealEstateDashboard() {
  const {
    data: statsData,
    error: statsError,
    loading: statsLoading,
  } = useDashboardResource(API_REAL_ESTATE.stats);

  const {
    data: propertiesData,
    error: propertiesError,
    loading: propertiesLoading,
  } = useDashboardResource(API_REAL_ESTATE.properties);

  const {
    data: typesData,
    error: typesError,
    loading: typesLoading,
  } = useDashboardResource(API_REAL_ESTATE.propertyTypes);

  const {
    data: salesData,
    error: salesError,
    loading: salesLoading,
  } = useDashboardResource(API_REAL_ESTATE.salesTrends);

  const {
    data: locationsData,
    error: locationsError,
    loading: locationsLoading,
  } = useDashboardResource(API_REAL_ESTATE.locations);

  const {
    data: priceData,
    error: priceError,
    loading: priceLoading,
  } = useDashboardResource(API_REAL_ESTATE.priceDistribution);

  return (
    <Container fluid>
      <Stack gap="lg">
        <PageHeader title="Real Estate dashboard" withActions={true} />

        <StatsGrid
          data={statsData ?? undefined}
          error={statsError}
          loading={statsLoading}
          paperProps={PAPER_PROPS}
        />

        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <DashboardSection title="Sales & Revenue Trends" {...PAPER_PROPS}>
              <SalesTrendsChart
                data={salesData ?? undefined}
                error={salesError}
                loading={salesLoading}
              />
            </DashboardSection>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <DashboardSection title="Property Types Distribution" {...PAPER_PROPS}>
              <PropertyTypesChart
                data={typesData ?? undefined}
                error={typesError}
                loading={typesLoading}
              />
            </DashboardSection>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <DashboardSection title="Price Distribution" {...PAPER_PROPS}>
              <PriceDistributionChart
                data={priceData ?? undefined}
                error={priceError}
                loading={priceLoading}
              />
            </DashboardSection>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <DashboardSection title="Top Locations" {...PAPER_PROPS}>
              <LocationAnalyticsTable
                data={locationsData ?? undefined}
                error={locationsError}
                loading={locationsLoading}
              />
            </DashboardSection>
          </Grid.Col>

          <Grid.Col span={12}>
            <DashboardSection title="Property Listings" {...PAPER_PROPS}>
              <PropertyListingsTable
                data={propertiesData ?? undefined}
                error={propertiesError}
                loading={propertiesLoading}
              />
            </DashboardSection>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
