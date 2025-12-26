'use client';

import {
  Container,
  Grid,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';

import {
  PageHeader,
  StatsGrid,
  Surface,
  LeadPipelineChart,
  DealsTable,
  ActivitiesTimeline,
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
  } = useFetch<IApiResponse<any[]>>('/api/crm/stats');

  const {
    data: leadsData,
    error: leadsError,
    loading: leadsLoading,
  } = useFetch<IApiResponse<any[]>>('/api/crm/leads');

  const {
    data: dealsData,
    error: dealsError,
    loading: dealsLoading,
  } = useFetch<IApiResponse<any[]>>('/api/crm/deals');

  const {
    data: activitiesData,
    error: activitiesError,
    loading: activitiesLoading,
  } = useFetch<IApiResponse<any[]>>('/api/crm/activities');

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
                <LeadPipelineChart
                  data={leadsData?.data || []}
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
                  data={dealsData?.data || []}
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
                  data={activitiesData?.data || []}
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
