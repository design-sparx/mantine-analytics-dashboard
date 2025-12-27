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
  PatientAppointmentsTable,
  BedOccupancyChart,
  MedicalInventoryTable,
  PatientSatisfactionChart,
  DepartmentPerformanceChart,
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
  } = useFetch<IApiResponse<any[]>>('/api/healthcare/stats');

  const {
    data: appointmentsData,
    error: appointmentsError,
    loading: appointmentsLoading,
  } = useFetch<IApiResponse<any[]>>('/api/healthcare/appointments');

  const {
    data: bedOccupancyData,
    error: bedOccupancyError,
    loading: bedOccupancyLoading,
  } = useFetch<IApiResponse<any[]>>('/api/healthcare/bed-occupancy');

  const {
    data: inventoryData,
    error: inventoryError,
    loading: inventoryLoading,
  } = useFetch<IApiResponse<any[]>>('/api/healthcare/inventory');

  const {
    data: satisfactionData,
    error: satisfactionError,
    loading: satisfactionLoading,
  } = useFetch<IApiResponse<any[]>>('/api/healthcare/satisfaction');

  const {
    data: departmentsData,
    error: departmentsError,
    loading: departmentsLoading,
  } = useFetch<IApiResponse<any[]>>('/api/healthcare/departments');

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
            data={statsData?.data || []}
            error={statsError}
            loading={statsLoading}
            paperProps={PAPER_PROPS}
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Surface {...PAPER_PROPS}>
                <PatientSatisfactionChart
                  data={satisfactionData?.data || []}
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
                  data={departmentsData?.data || []}
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
                  data={bedOccupancyData?.data || []}
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
                  data={inventoryData?.data?.slice(0, 5) || []}
                  error={inventoryError}
                  loading={inventoryLoading}
                />
              </Surface>
            </Grid.Col>

            <Grid.Col span={12}>
              <Surface {...PAPER_PROPS}>
                <Text size="lg" fw={600} mb="md">
                  Today's Appointments
                </Text>
                <PatientAppointmentsTable
                  data={appointmentsData?.data || []}
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
