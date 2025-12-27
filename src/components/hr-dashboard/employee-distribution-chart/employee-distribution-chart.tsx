import { PieChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface EmployeeDistribution {
  department: string;
  count: number;
  percentage: number;
  color: string;
}

interface EmployeeDistributionChartProps {
  data?: EmployeeDistribution[];
  loading?: boolean;
  error?: Error | null;
}

export const EmployeeDistributionChart: React.FC<EmployeeDistributionChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading employee distribution"
        message={error.message || 'Failed to load employee distribution data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={300} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        No employee distribution data available
      </Text>
    );
  }

  return (
    <PieChart
      data={data.map(item => ({
        name: item.department,
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
