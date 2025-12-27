import { CompositeChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface SalesTrend {
  month: string;
  sales: number;
  revenue: number;
  avgPrice: number;
}

interface SalesTrendsChartProps {
  data?: SalesTrend[];
  loading?: boolean;
  error?: Error | null;
}

export const SalesTrendsChart: React.FC<SalesTrendsChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading sales trends"
        message={error.message || 'Failed to load sales trends data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={350} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        No sales trends data available
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
        { name: 'sales', color: 'blue', label: 'Sales', type: 'bar' },
        { name: 'revenue', color: 'green', label: 'Revenue ($M)', type: 'line' },
      ]}
      curveType="linear"
      tickLine="y"
      gridAxis="y"
      withLegend
      legendProps={{ verticalAlign: 'bottom' }}
    />
  );
};
