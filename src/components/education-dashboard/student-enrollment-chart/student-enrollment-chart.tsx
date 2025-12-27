import { Text, Skeleton, Stack } from '@mantine/core';
import { AreaChart } from '@mantine/charts';
import { ErrorAlert } from '@/components';

interface EnrollmentData {
  month: string;
  newStudents: number;
  activeStudents: number;
  dropouts: number;
}

interface StudentEnrollmentChartProps {
  data?: EnrollmentData[];
  loading?: boolean;
  error?: Error | null;
}

export const StudentEnrollmentChart: React.FC<StudentEnrollmentChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading enrollment data"
        message={error.message || 'Failed to load student enrollment'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        <Skeleton height={20} width="40%" radius="sm" />
        <Skeleton height={300} radius="sm" />
      </Stack>
    );
  }

  return (
    <>
      <Text size="lg" fw={600} mb="md">
        Student Enrollment Trends
      </Text>
      <AreaChart
        h={300}
        data={data}
        dataKey="month"
        series={[
          { name: 'activeStudents', label: 'Active Students', color: 'blue' },
          { name: 'newStudents', label: 'New Enrollments', color: 'teal' },
          { name: 'dropouts', label: 'Dropouts', color: 'red' },
        ]}
        curveType="natural"
        withLegend
        withTooltip
      />
    </>
  );
};
