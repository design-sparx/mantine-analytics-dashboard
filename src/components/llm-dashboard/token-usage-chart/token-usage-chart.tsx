import { AreaChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';

import { ErrorAlert } from '@/components';

import type { LlmTokenTrendDto } from '@/types';

interface TokenUsageChartProps {
  data?: LlmTokenTrendDto[] | null;
  loading?: boolean;
  error?: Error | null;
}

export const TokenUsageChart: React.FC<TokenUsageChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading token usage"
        message={error.message || 'Failed to load token usage data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={350} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        No token usage data available
      </Text>
    );
  }

  return (
    <AreaChart
      h={350}
      data={data}
      dataKey="month"
      series={[
        { name: 'input', color: 'blue', label: 'Input Tokens (M)' },
        { name: 'output', color: 'green', label: 'Output Tokens (M)' },
        { name: 'total', color: 'violet', label: 'Total (M)' },
      ]}
      curveType="natural"
      tickLine="y"
      gridAxis="y"
      withLegend
      legendProps={{ verticalAlign: 'bottom' }}
    />
  );
};
