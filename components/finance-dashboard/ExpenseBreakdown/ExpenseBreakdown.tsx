import { DonutChart } from '@mantine/charts';
import { Skeleton, Stack, Group, Text, Badge, SimpleGrid } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { ErrorAlert } from '@/components';

interface Expense {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  trend: number;
}

interface ExpenseBreakdownProps {
  data?: Expense[];
  loading?: boolean;
  error?: Error | null;
}

export const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading expenses"
        message={error.message || 'Failed to load expense breakdown'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={400} radius="sm" />;
  }

  const totalExpenses = data.reduce((sum, item) => sum + item.amount, 0);

  const chartData = data.map((item) => ({
    name: item.category,
    value: item.amount,
    color: `var(--mantine-color-${item.color}-6)`,
  }));

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Text size="lg" fw={600}>
            Expense Breakdown
          </Text>
          <Text size="sm" c="dimmed">
            Total: ${totalExpenses.toLocaleString('en-US')}
          </Text>
        </div>
      </Group>

      <Group justify="center">
        <DonutChart
          size={220}
          thickness={35}
          data={chartData}
          paddingAngle={3}
          tooltipDataSource="segment"
          valueFormatter={(value) => `$${value.toLocaleString('en-US')}`}
        />
      </Group>

      <SimpleGrid cols={2} spacing="md">
        {data.map((expense) => (
          <Stack key={expense.category} gap={4}>
            <Group justify="space-between">
              <Group gap="xs">
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: `var(--mantine-color-${expense.color}-6)`,
                  }}
                />
                <Text size="sm" fw={500}>
                  {expense.category}
                </Text>
              </Group>
              <Group gap={4}>
                {expense.trend >= 0 ? (
                  <IconTrendingUp size={14} color="var(--mantine-color-red-6)" />
                ) : (
                  <IconTrendingDown size={14} color="var(--mantine-color-teal-6)" />
                )}
                <Text size="xs" c={expense.trend >= 0 ? 'red' : 'teal'}>
                  {Math.abs(expense.trend)}%
                </Text>
              </Group>
            </Group>
            <Group justify="space-between">
              <Text size="sm" fw={600}>
                ${expense.amount.toLocaleString('en-US')}
              </Text>
              <Text size="xs" c="dimmed">
                {expense.percentage.toFixed(1)}%
              </Text>
            </Group>
          </Stack>
        ))}
      </SimpleGrid>
    </Stack>
  );
};
