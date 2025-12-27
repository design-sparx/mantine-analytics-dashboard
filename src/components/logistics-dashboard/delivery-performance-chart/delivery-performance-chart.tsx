import { LineChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface DeliveryPerformance {
  month: string;
  onTime: number;
  delayed: number;
  total: number;
}

interface DeliveryPerformanceChartProps {
  data?: DeliveryPerformance[];
  loading?: boolean;
  error?: Error | null;
}

export const DeliveryPerformanceChart: React.FC<DeliveryPerformanceChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading delivery performance"
        message={error.message || 'Failed to load delivery performance data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={350} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        No delivery performance data available
      </Text>
    );
  }

  return (
    <LineChart
      h={350}
      data={data}
      dataKey="month"
      series={[
        { name: 'onTime', color: 'green', label: 'On-Time (%)' },
        { name: 'delayed', color: 'red', label: 'Delayed (%)' },
      ]}
      curveType="linear"
      tickLine="y"
      gridAxis="y"
      withLegend
      legendProps={{ verticalAlign: 'bottom' }}
    />
  );
};
