import { PieChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface UseCase {
  useCase: string;
  percentage: number;
  requests: number;
  color: string;
}

interface UseCaseChartProps {
  data?: UseCase[];
  loading?: boolean;
  error?: Error | null;
}

export const UseCaseChart: React.FC<UseCaseChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading use cases"
        message={error.message || 'Failed to load use case data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={300} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        No use case data available
      </Text>
    );
  }

  return (
    <PieChart
      data={data.map(item => ({
        name: item.useCase,
        value: item.percentage,
        color: item.color,
      }))}
      withLabelsLine
      labelsPosition="outside"
      labelsType="percent"
      withTooltip
      tooltipDataSource="segment"
      size={250}
    />
  );
};
