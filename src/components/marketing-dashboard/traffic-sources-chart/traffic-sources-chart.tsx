import { Skeleton, Stack } from '@mantine/core';
import { DonutChart } from '@mantine/charts';
import { ErrorAlert } from '@/components';

interface TrafficSource {
  name: string;
  value: number;
  visitors: number;
  color: string;
}

interface TrafficSourcesChartProps {
  data?: TrafficSource[];
  loading?: boolean;
  error?: Error | null;
}

export const TrafficSourcesChart: React.FC<TrafficSourcesChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading traffic sources"
        message={error.message || 'Failed to load traffic data'}
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
