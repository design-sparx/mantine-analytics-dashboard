import { AreaChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface PerformanceData {
  month: string;
  excellent: number;
  good: number;
  average: number;
  poor: number;
}

interface EmployeePerformanceChartProps {
  data?: PerformanceData[];
  loading?: boolean;
  error?: Error | null;
}

export const EmployeePerformanceChart: React.FC<EmployeePerformanceChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading performance data"
        message={error.message || 'Failed to load employee performance data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={350} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        No performance data available
      </Text>
    );
  }

  return (
    <AreaChart
      h={350}
      data={data}
      dataKey="month"
      series={[
        { name: 'excellent', color: 'green', label: 'Excellent' },
        { name: 'good', color: 'blue', label: 'Good' },
        { name: 'average', color: 'yellow', label: 'Average' },
        { name: 'poor', color: 'red', label: 'Poor' },
      ]}
      curveType="natural"
      tickLine="y"
      gridAxis="y"
      withLegend
      legendProps={{ verticalAlign: 'bottom' }}
    />
  );
};
