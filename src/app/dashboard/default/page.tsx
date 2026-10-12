import {
  Container,
  Grid,
  GridCol,
  Group,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';

import { PageHeader, ProjectsTable, StatsGrid, Surface } from '@/components';
import MobileDesktopChart from '@/components/mobile-desktop-chart/MobileDesktopChartClient';
import RevenueChart from '@/components/revenue-chart/RevenueChartClient';
import SalesChart from '@/components/sales-chart/SalesChartClient';
import { loadMock } from '@/lib/api/mock-route';

import { ViewAllTasksButton } from './ViewAllTasksButton';

import type { CoreStatsDto } from '@/types/dashboard';
import type { ProjectsDto } from '@/types/generated-fixtures';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Default Dashboard',
};

const PAPER_PROPS: PaperProps = {
  p: 'md',
  style: { minHeight: '100%' },
};

export default async function Page() {
  const [projectsResult, statsResult] = await Promise.all([
    loadMock<ProjectsDto[]>('Projects.json'),
    loadMock<CoreStatsDto>('StatsGrid.json'),
  ]);

  const projectsData = projectsResult.data ?? [];
  const statsData = statsResult.data?.data ?? [];

  return (
    <>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Default dashboard" withActions={true} />
          <StatsGrid
            data={statsData?.slice(0, 4)}
            loading={false}
            error={statsResult.error}
            paperProps={PAPER_PROPS}
          />
          <Grid gap={{ base: 5, xs: 'md', md: 'md', lg: 'lg', xl: 'xl' }}>
            <GridCol span={8}>
              <RevenueChart {...PAPER_PROPS} />
            </GridCol>
            <GridCol span={4}>
              <SalesChart {...PAPER_PROPS} />
            </GridCol>
            <GridCol span={4}>
              <MobileDesktopChart {...PAPER_PROPS} />
            </GridCol>
            <GridCol span={8}>
              <Surface {...PAPER_PROPS}>
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={600}>
                    Tasks
                  </Text>
                  <ViewAllTasksButton />
                </Group>
                <ProjectsTable
                  data={projectsData?.slice(0, 6) ?? undefined}
                  error={projectsResult.error}
                  loading={false}
                />
              </Surface>
            </GridCol>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
