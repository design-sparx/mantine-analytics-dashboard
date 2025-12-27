import { Skeleton, Stack } from '@mantine/core';
import { PieChart } from '@mantine/charts';
import { ErrorAlert } from '@/components';

interface GradeData {
  name: string;
  value: number;
  students: number;
  color: string;
}

interface GradeDistributionChartProps {
  data?: GradeData[];
  loading?: boolean;
  error?: Error | null;
}

export const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading grade data"
        message={error.message || 'Failed to load grade distribution'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        <Skeleton height={250} radius="sm" />
      </Stack>
    );
  }

  return (
    <PieChart
      data={data}
      withLabels
      withTooltip
      size={200}
    />
  );
};
