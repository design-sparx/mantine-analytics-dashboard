import { BarChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface CostAnalysis {
  month: string;
  apiCost: number;
  computeCost: number;
  storageCost: number;
  total: number;
}

interface CostAnalysisChartProps {
  data?: CostAnalysis[];
  loading?: boolean;
  error?: Error | null;
}

export const CostAnalysisChart: React.FC<CostAnalysisChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading cost analysis"
        message={error.message || 'Failed to load cost analysis data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={300} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        No cost data available
      </Text>
    );
  }

  return (
    <BarChart
      h={300}
      data={data}
      dataKey="month"
      type="stacked"
      series={[
        { name: 'apiCost', color: 'blue', label: 'API Cost ($K)' },
        { name: 'computeCost', color: 'green', label: 'Compute ($K)' },
        { name: 'storageCost', color: 'orange', label: 'Storage ($K)' },
      ]}
      tickLine="y"
      gridAxis="y"
      withLegend
      legendProps={{ verticalAlign: 'bottom' }}
    />
  );
};
