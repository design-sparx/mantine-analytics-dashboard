'use client';

import { Container, Grid, PaperProps, Stack, Text } from '@mantine/core';

import {
  LocationAnalyticsTable,
  PageHeader,
  PriceDistributionChart,
  PropertyListingsTable,
  PropertyTypesChart,
  SalesTrendsChart,
  StatsGrid,
  Surface,
} from '@/components';
import { useDashboardResource } from '@/lib/api/useDashboardResource';
import { API_REAL_ESTATE } from '@/routes/api';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  style: { minHeight: '100%' },
};

function Page() {
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
    <>
      <>
        <title>Real Estate Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="Real estate dashboard for property management, sales tracking, market analytics, and location performance. Monitor property listings and analyze real estate market trends."
        />
      </>
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
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Sales & Revenue Trends
                </Text>
                <SalesTrendsChart
                  data={salesData ?? undefined}
                  error={salesError}
                  loading={salesLoading}
                />
              </Surface>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Property Types Distribution
                </Text>
                <PropertyTypesChart
                  data={typesData ?? undefined}
                  error={typesError}
                  loading={typesLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Price Distribution
                </Text>
                <PriceDistributionChart
                  data={priceData ?? undefined}
                  error={priceError}
                  loading={priceLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Top Locations
                </Text>
                <LocationAnalyticsTable
                  data={locationsData ?? undefined}
                  error={locationsError}
                  loading={locationsLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={12}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Property Listings
                </Text>
                <PropertyListingsTable
                  data={propertiesData ?? undefined}
                  error={propertiesError}
                  loading={propertiesLoading}
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
