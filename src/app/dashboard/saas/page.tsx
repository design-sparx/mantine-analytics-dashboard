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

import {
  PageHeader,
  ProjectsTable,
  RevenueChart,
  SalesChart,
  StatsGrid,
  Surface,
} from '@/components';
import { useDashboardResource } from '@/lib/api/useDashboardResource';
import { API_CORE } from '@/routes/api';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  style: { minHeight: '100%' },
};

function Page() {
  const {
    data: statsData,
    error: statsError,
    loading: statsLoading,
  } = useDashboardResource(API_CORE.stats as any);
  const {
    data: projectsData,
    error: projectsError,
    loading: projectsLoading,
  } = useDashboardResource(API_CORE.projects as any);

  return (
    <>
      <>
        <title>SaaS Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="SaaS dashboard" withActions={true} />
          <StatsGrid
            data={statsData ?? undefined}
            error={statsError}
            loading={statsLoading}
            paperProps={PAPER_PROPS}
          />
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 5 }}>
              {/* MapChart removed for fetch standardization */}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 7 }}>
              <RevenueChart {...PAPER_PROPS} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <SalesChart {...PAPER_PROPS} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
              <Surface {...PAPER_PROPS}>
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={600}>
                    Tasks
                  </Text>
                  <Button
                    variant="subtle"
                    rightSection={<IconChevronRight size={16} />}
                  >
                    View all
                  </Button>
                </Group>
                <ProjectsTable
                  data={projectsData?.slice(0, 6)}
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
