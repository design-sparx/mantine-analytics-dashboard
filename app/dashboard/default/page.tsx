'use client';

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

import {
  MobileDesktopChart,
  PageHeader,
  ProjectsTable,
  RevenueChart,
  SalesChart,
  StatsGrid,
  Surface,
} from '@/components';
import {
  useAllStats,
  useProjects,
  useSales,
  useTraffic,
} from '@/lib/endpoints';
import { PATH_TASKS } from '@/routes';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  style: { minHeight: '100%' },
};

function Page() {
  // Use new API endpoints with RBAC
  const {
    data: projectsData,
    error: projectsError,
    loading: projectsLoading,
  } = useProjects({ limit: 6 });

  const {
    data: statsData,
    error: statsError,
    loading: statsLoading,
  } = useAllStats();

  const {
    data: salesData,
    error: salesError,
    loading: salesLoading,
  } = useSales();

  const {
    data: trafficData,
    error: trafficError,
    loading: trafficLoading,
  } = useTraffic();

  return (
    <>
      <>
        <title>Default Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Default dashboard" withActions={true} />
          <StatsGrid
            data={statsData?.data || []}
            loading={statsLoading}
            error={statsError}
            paperProps={PAPER_PROPS}
          />
          <Grid gutter={{ base: 5, xs: 'md', md: 'md', lg: 'lg', xl: 'xl' }}>
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
                  data={projectsData?.data?.slice(0, 6) || []}
                  error={projectsError}
                  loading={projectsLoading}
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
