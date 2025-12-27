import { Skeleton, Stack } from '@mantine/core';
import { BarChart } from '@mantine/charts';
import { ErrorAlert } from '@/components';

interface ActivityData {
  day: string;
  logins: number;
  assignmentsSubmitted: number;
  forumPosts: number;
}

interface StudentActivityChartProps {
  data?: ActivityData[];
  loading?: boolean;
  error?: Error | null;
}

export const StudentActivityChart: React.FC<StudentActivityChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading activity data"
        message={error.message || 'Failed to load student activity'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        <Skeleton height={300} radius="sm" />
      </Stack>
    );
  }

  return (
    <BarChart
      h={300}
      data={data}
      dataKey="day"
      series={[
        { name: 'logins', label: 'Daily Logins', color: 'blue' },
        { name: 'assignmentsSubmitted', label: 'Assignments', color: 'teal' },
        { name: 'forumPosts', label: 'Forum Posts', color: 'violet' },
      ]}
      withLegend
      withTooltip
    />
  );
};
