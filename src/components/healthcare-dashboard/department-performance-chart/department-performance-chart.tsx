import { Skeleton, Stack } from '@mantine/core';
import { DonutChart } from '@mantine/charts';
import { ErrorAlert } from '@/components';

interface DepartmentData {
  name: string;
  value: number;
  patients: number;
  color: string;
}

interface DepartmentPerformanceChartProps {
  data?: DepartmentData[];
  loading?: boolean;
  error?: Error | null;
}

export const DepartmentPerformanceChart: React.FC<DepartmentPerformanceChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading department data"
        message={error.message || 'Failed to load department performance'}
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
    <DonutChart
      data={data}
      withLabels
      withTooltip
      size={200}
      thickness={35}
    />
  );
};
