'use client';

import { Container, Grid, PaperProps, Stack, Text } from '@mantine/core';
import { useFetch } from '@mantine/hooks';

import {
  BedOccupancyChart,
  DepartmentPerformanceChart,
  MedicalInventoryTable,
  PageHeader,
  PatientAppointmentsTable,
  PatientSatisfactionChart,
  StatsGrid,
  Surface,
} from '@/components';
import { useDashboardResource } from '@/lib/api/useDashboardResource';
import { API_HEALTHCARE } from '@/routes/api';
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
  } = useDashboardResource(API_HEALTHCARE.stats);

  const {
    data: appointmentsData,
    error: appointmentsError,
    loading: appointmentsLoading,
  } = useDashboardResource(API_HEALTHCARE.appointments);

  const {
    data: bedOccupancyData,
    error: bedOccupancyError,
    loading: bedOccupancyLoading,
  } = useDashboardResource(API_HEALTHCARE.bedOccupancy);

  const {
    data: inventoryData,
    error: inventoryError,
    loading: inventoryLoading,
  } = useDashboardResource(API_HEALTHCARE.inventory);

  const {
    data: satisfactionData,
    error: satisfactionError,
    loading: satisfactionLoading,
  } = useDashboardResource(API_HEALTHCARE.satisfaction);

  const {
    data: departmentsData,
    error: departmentsError,
    loading: departmentsLoading,
  } = useDashboardResource(API_HEALTHCARE.departments);

  return (
    <>
      <>
        <title>Healthcare Dashboard | DesignSparx</title>
        <meta
          name="description"
          content="Healthcare dashboard for patient management, appointment tracking, bed occupancy monitoring, and medical inventory management. Track hospital operations and patient satisfaction."
        />
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Healthcare dashboard" withActions={true} />

          <StatsGrid
            data={statsData ?? undefined}
            error={statsError}
            loading={statsLoading}
            paperProps={PAPER_PROPS}
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Surface {...PAPER_PROPS}>
                <PatientSatisfactionChart
                  data={satisfactionData ?? undefined}
                  error={satisfactionError}
                  loading={satisfactionLoading}
                />
              </Surface>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Department Distribution
                </Text>
                <DepartmentPerformanceChart
                  data={departmentsData ?? undefined}
                  error={departmentsError}
                  loading={departmentsLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Bed Occupancy by Department
                </Text>
                <BedOccupancyChart
                  data={bedOccupancyData ?? undefined}
                  error={bedOccupancyError}
                  loading={bedOccupancyLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Medical Inventory Status
                </Text>
                <MedicalInventoryTable
                  data={inventoryData?.slice(0, 5)}
                  error={inventoryError}
                  loading={inventoryLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={12}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Today&apos;s Appointments
                </Text>
                <PatientAppointmentsTable
                  data={appointmentsData ?? undefined}
                  error={appointmentsError}
                  loading={appointmentsLoading}
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
