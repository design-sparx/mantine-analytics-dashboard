'use client';

import { Container, Grid, PaperProps, Stack, Text } from '@mantine/core';
import { useFetch } from '@mantine/hooks';

import {
  ActivitiesTimeline,
  DealsTable,
  LeadPipelineChart,
  PageHeader,
  RevenueChart,
  StatsGrid,
  Surface,
} from '@/components';
import { useDashboardResource } from '@/lib/api/useDashboardResource';
import { API_CRM } from '@/routes/api';
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
  } = useDashboardResource(API_CRM.stats);

  const {
    data: leadsData,
    error: leadsError,
    loading: leadsLoading,
  } = useDashboardResource(API_CRM.leads);

  const {
    data: dealsData,
    error: dealsError,
    loading: dealsLoading,
  } = useDashboardResource(API_CRM.deals);

  const {
    data: activitiesData,
    error: activitiesError,
    loading: activitiesLoading,
  } = useDashboardResource(API_CRM.activities);

  return (
    <>
      <>
        <title>CRM Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="CRM dashboard for customer relationship management, sales pipeline tracking, lead management, and deal monitoring. Track customer lifetime value and acquisition costs."
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="CRM dashboard" withActions={true} />

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
                <LeadPipelineChart
                  data={leadsData ?? undefined}
                  error={leadsError}
                  loading={leadsLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Active Deals
                </Text>
                <DealsTable
                  data={dealsData ?? undefined}
                  error={dealsError}
                  loading={dealsLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Recent Activities
                </Text>
                <ActivitiesTimeline
                  data={activitiesData ?? undefined}
                  error={activitiesError}
                  loading={activitiesLoading}
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
