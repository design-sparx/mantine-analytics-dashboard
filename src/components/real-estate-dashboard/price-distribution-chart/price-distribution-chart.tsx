import { BarChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface PriceDistribution {
  range: string;
  count: number;
  color: string;
}

interface PriceDistributionChartProps {
  data?: PriceDistribution[];
  loading?: boolean;
  error?: Error | null;
}

export const PriceDistributionChart: React.FC<PriceDistributionChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading price distribution"
        message={error.message || 'Failed to load price distribution data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={300} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        No price distribution data available
      </Text>
    );
  }

  return (
    <BarChart
      h={300}
      data={data}
      dataKey="range"
      series={[{ name: 'count', color: 'violet', label: 'Properties' }]}
      tickLine="y"
      gridAxis="y"
      withLegend
    />
  );
};
