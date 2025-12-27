import { PieChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface PropertyType {
  type: string;
  count: number;
  percentage: number;
  avgPrice: number;
  color: string;
}

interface PropertyTypesChartProps {
  data?: PropertyType[];
  loading?: boolean;
  error?: Error | null;
}

export const PropertyTypesChart: React.FC<PropertyTypesChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading property types"
        message={error.message || 'Failed to load property types data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={300} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        No property types data available
      </Text>
    );
  }

  return (
    <PieChart
      data={data.map(item => ({
        name: item.type,
        value: item.count,
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
