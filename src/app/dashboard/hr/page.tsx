'use client';

import { Container, Grid, PaperProps, Stack, Text } from '@mantine/core';
import { useFetch } from '@mantine/hooks';

import {
  AttendanceChart,
  EmployeeDistributionChart,
  EmployeePerformanceChart,
  OpenPositionsTable,
  PageHeader,
  RecruitmentPipelineChart,
  StatsGrid,
  Surface,
} from '@/components';
import { useDashboardResource } from '@/lib/api/useDashboardResource';
import { API_HR } from '@/routes/api';
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
  } = useDashboardResource(API_HR.stats);

  const {
    data: distributionData,
    error: distributionError,
    loading: distributionLoading,
  } = useDashboardResource(API_HR.employeeDistribution);

  const {
    data: pipelineData,
    error: pipelineError,
    loading: pipelineLoading,
  } = useDashboardResource(API_HR.recruitmentPipeline);

  const {
    data: performanceData,
    error: performanceError,
    loading: performanceLoading,
  } = useDashboardResource(API_HR.performance);

  const {
    data: positionsData,
    error: positionsError,
    loading: positionsLoading,
  } = useDashboardResource(API_HR.openPositions);

  const {
    data: attendanceData,
    error: attendanceError,
    loading: attendanceLoading,
  } = useDashboardResource(API_HR.attendance);

  return (
    <>
      <>
        <title>HR Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="HR dashboard for employee management, recruitment tracking, performance monitoring, and attendance analytics. Manage workforce and analyze HR operations."
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="HR dashboard" withActions={true} />

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
                  Employee Performance Trends
                </Text>
                <EmployeePerformanceChart
                  data={performanceData ?? undefined}
                  error={performanceError}
                  loading={performanceLoading}
                />
              </Surface>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Employee Distribution
                </Text>
                <EmployeeDistributionChart
                  data={distributionData ?? undefined}
                  error={distributionError}
                  loading={distributionLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Recruitment Pipeline
                </Text>
                <RecruitmentPipelineChart
                  data={pipelineData ?? undefined}
                  error={pipelineError}
                  loading={pipelineLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Attendance Tracking
                </Text>
                <AttendanceChart
                  data={attendanceData ?? undefined}
                  error={attendanceError}
                  loading={attendanceLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={12}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Open Positions
                </Text>
                <OpenPositionsTable
                  data={positionsData ?? undefined}
                  error={positionsError}
                  loading={positionsLoading}
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
