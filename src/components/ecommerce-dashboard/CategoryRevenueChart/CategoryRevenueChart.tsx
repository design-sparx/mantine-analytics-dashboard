import { BarChart } from '@mantine/charts';
import { Skeleton, Stack, Group, Text, Badge } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface CategoryRevenue {
  category: string;
  revenue: number;
  orders: number;
  percentage: number;
  color: string;
}

interface CategoryRevenueChartProps {
  data?: CategoryRevenue[];
  loading?: boolean;
  error?: Error | null;
}

export const CategoryRevenueChart: React.FC<CategoryRevenueChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading category revenue"
        message={error.message || 'Failed to load category revenue'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={350} radius="sm" />;
  }

  const chartData = data.map((item) => ({
    category: item.category,
    revenue: item.revenue,
    orders: item.orders,
  }));

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Text size="lg" fw={600}>
            Revenue by Category
          </Text>
          <Text size="sm" c="dimmed">
            Total: ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
        </div>
      </Group>

      <BarChart
        h={280}
        data={chartData}
        dataKey="category"
        series={[
          { name: 'revenue', label: 'Revenue', color: 'blue.6' },
        ]}
        tickLine="y"
        gridAxis="y"
        withLegend
        legendProps={{ verticalAlign: 'bottom', height: 50 }}
        valueFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
      />

      <Group gap="md" justify="center">
        {data.map((item) => (
          <Badge
            key={item.category}
            variant="light"
            color={item.color}
            size="lg"
            leftSection={
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: `var(--mantine-color-${item.color}-6)`,
                }}
              />
            }
          >
            {item.category}: {item.percentage.toFixed(1)}%
          </Badge>
        ))}
      </Group>
    </Stack>
  );
};
