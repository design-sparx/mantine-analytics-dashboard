import {
  Button,
  Container,
  Grid,
  Group,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

import { PageHeader, ProjectsTable, StatsGrid, Surface } from '@/components';
import MobileDesktopChart from '@/components/mobile-desktop-chart/MobileDesktopChartClient';
import RevenueChart from '@/components/revenue-chart/RevenueChartClient';
import SalesChart from '@/components/sales-chart/SalesChartClient';
import { PATH_TASKS } from '@/routes';
import { API_CORE } from '@/routes/api';

import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Default Dashboard',
};

const PAPER_PROPS: PaperProps = {
  p: 'md',
  style: { minHeight: '100%' },
};

async function fetchData<T>(endpoint: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || ''}${endpoint}`,
    {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    },
  );
  if (!res.ok) return { data: null, error: 'Failed to fetch', loading: false };
  return res.json();
}

export default async function Page() {
  const [projectsResult, statsResult] = await Promise.all([
    fetchData(API_CORE.projects),
    fetchData(API_CORE.stats),
  ]);

  const projectsData = projectsResult.data?.data ?? projectsResult.data ?? [];
  const statsData = statsResult.data?.data ?? statsResult.data ?? [];

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
            <Grid.Col span={8}>
              <RevenueChart {...PAPER_PROPS} />
            </Grid.Col>
            <Grid.Col span={4}>
              <SalesChart {...PAPER_PROPS} />
            </Grid.Col>
            <Grid.Col span={4}>
              <MobileDesktopChart {...PAPER_PROPS} />
            </Grid.Col>
            <Grid.Col span={8}>
              <Surface {...PAPER_PROPS}>
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={600}>
                    Tasks
                  </Text>
                  <Button
                    variant="subtle"
                    component={Link}
                    href={PATH_TASKS.root}
                    rightSection={<IconChevronRight size={18} />}
                  >
                    View all
                  </Button>
                </Group>
                <ProjectsTable
                  data={projectsData?.slice(0, 6) ?? undefined}
                  error={projectsResult.error}
                  loading={false}
                />
              </Surface>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
