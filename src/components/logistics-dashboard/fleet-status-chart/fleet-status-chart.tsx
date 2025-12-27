import { BarChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface FleetStatus {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

interface FleetStatusChartProps {
  data?: FleetStatus[];
  loading?: boolean;
  error?: Error | null;
}

export const FleetStatusChart: React.FC<FleetStatusChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading fleet status"
        message={error.message || 'Failed to load fleet status data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={300} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        No fleet status data available
      </Text>
    );
  }

  return (
    <BarChart
      h={300}
      data={data}
      dataKey="category"
      series={[{ name: 'count', color: 'blue', label: 'Vehicles' }]}
      tickLine="y"
      gridAxis="y"
      withLegend
    />
  );
};
