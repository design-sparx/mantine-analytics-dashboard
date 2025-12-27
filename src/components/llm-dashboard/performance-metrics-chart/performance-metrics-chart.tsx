import { CompositeChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface PerformanceMetrics {
  month: string;
  latency: number;
  errorRate: number;
  throughput: number;
}

interface PerformanceMetricsChartProps {
  data?: PerformanceMetrics[];
  loading?: boolean;
  error?: Error | null;
}

export const PerformanceMetricsChart: React.FC<PerformanceMetricsChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading performance metrics"
        message={error.message || 'Failed to load performance metrics'}
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
    <CompositeChart
      h={350}
      data={data}
      dataKey="month"
      maxBarWidth={30}
      series={[
        { name: 'latency', color: 'blue', label: 'Latency (s)', type: 'line' },
        { name: 'errorRate', color: 'red', label: 'Error Rate (%)', type: 'line' },
        { name: 'throughput', color: 'green', label: 'Throughput (req/s)', type: 'bar' },
      ]}
      curveType="linear"
      tickLine="y"
      gridAxis="y"
      withLegend
      legendProps={{ verticalAlign: 'bottom' }}
    />
  );
};
