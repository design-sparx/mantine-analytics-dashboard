'use client';

import { Container, Grid, PaperProps, Stack, Text } from '@mantine/core';
import { useFetch } from '@mantine/hooks';

import {
  CourseCompletionTable,
  GradeDistributionChart,
  InstructorPerformanceTable,
  PageHeader,
  StatsGrid,
  StudentActivityChart,
  StudentEnrollmentChart,
  Surface,
} from '@/components';
import { useDashboardResource } from '@/lib/api/useDashboardResource';
import { API_EDUCATION } from '@/routes/api';
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
  } = useDashboardResource(API_EDUCATION.stats);

  const {
    data: enrollmentData,
    error: enrollmentError,
    loading: enrollmentLoading,
  } = useDashboardResource(API_EDUCATION.enrollment);

  const {
    data: coursesData,
    error: coursesError,
    loading: coursesLoading,
  } = useDashboardResource(API_EDUCATION.courses);

  const {
    data: gradesData,
    error: gradesError,
    loading: gradesLoading,
  } = useDashboardResource(API_EDUCATION.grades);

  const {
    data: instructorsData,
    error: instructorsError,
    loading: instructorsLoading,
  } = useDashboardResource(API_EDUCATION.instructors);

  const {
    data: activityData,
    error: activityError,
    loading: activityLoading,
  } = useDashboardResource(API_EDUCATION.activity);

  return (
    <>
      <>
        <title>Education Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="Education dashboard for student enrollment tracking, course completion monitoring, grade analysis, and instructor performance. Manage your learning management system effectively."
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Education dashboard" withActions={true} />

          <StatsGrid
            data={statsData ?? undefined}
            error={statsError}
            loading={statsLoading}
            paperProps={PAPER_PROPS}
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Surface {...PAPER_PROPS}>
                <StudentEnrollmentChart
                  data={enrollmentData ?? undefined}
                  error={enrollmentError}
                  loading={enrollmentLoading}
                />
              </Surface>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Grade Distribution
                </Text>
                <GradeDistributionChart
                  data={gradesData ?? undefined}
                  error={gradesError}
                  loading={gradesLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={12}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Student Activity (This Week)
                </Text>
                <StudentActivityChart
                  data={activityData ?? undefined}
                  error={activityError}
                  loading={activityLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Course Completion Rates
                </Text>
                <CourseCompletionTable
                  data={coursesData ?? undefined}
                  error={coursesError}
                  loading={coursesLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Instructor Performance
                </Text>
                <InstructorPerformanceTable
                  data={instructorsData ?? undefined}
                  error={instructorsError}
                  loading={instructorsLoading}
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
