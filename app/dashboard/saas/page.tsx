'use client';

import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

import {
  MapChart,
  PageHeader,
  ProjectsTable,
  RevenueChart,
  SalesChart,
  StatsGrid,
  Surface,
} from '@/components';
import { useAllStats, useProjects } from '@/lib/endpoints';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  style: { minHeight: '100%' },
};

function Page() {
  const {
    data: statsData,
    error: statsError,
    loading: statsLoading,
  } = useAllStats();
  const {
    data: projectsData,
    error: projectsError,
    loading: projectsLoading,
  } = useProjects();

  return (
    <>
      <>
        <title>Sass Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Saas dashboard" withActions={true} />
          <StatsGrid
            data={statsData?.data || []}
            error={statsError}
            loading={statsLoading}
            paperProps={PAPER_PROPS}
          />
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 5 }}>
              <MapChart {...PAPER_PROPS} />
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
