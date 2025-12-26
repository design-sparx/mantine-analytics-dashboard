import { AreaChart } from '@mantine/charts';
import { Skeleton, Stack, Group, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface Cashflow {
  month: string;
  income: number;
  expenses: number;
  netCashflow: number;
}

interface CashflowChartProps {
  data?: Cashflow[];
  loading?: boolean;
  error?: Error | null;
}

export const CashflowChart: React.FC<CashflowChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading cashflow"
        message={error.message || 'Failed to load cashflow data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={350} radius="sm" />;
  }

  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const netCashflow = totalIncome - totalExpenses;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Text size="lg" fw={600}>
            Cashflow Overview
          </Text>
          <Text size="sm" c="dimmed">
            Income vs Expenses (12 months)
          </Text>
        </div>
        <Group gap="xl">
          <div style={{ textAlign: 'right' }}>
            <Text size="xs" c="dimmed">
              Net Cashflow
            </Text>
            <Text size="lg" fw={700} c={netCashflow >= 0 ? 'teal' : 'red'}>
              ${netCashflow.toLocaleString('en-US')}
            </Text>
          </div>
        </Group>
      </Group>

      <AreaChart
        h={280}
        data={data}
        dataKey="month"
        series={[
          { name: 'income', label: 'Income', color: 'teal.6' },
          { name: 'expenses', label: 'Expenses', color: 'red.6' },
          { name: 'netCashflow', label: 'Net Cashflow', color: 'blue.6' },
        ]}
        curveType="monotone"
        tickLine="y"
        gridAxis="y"
        withLegend
        legendProps={{ verticalAlign: 'bottom', height: 50 }}
        valueFormatter={(value) => `$${value.toLocaleString('en-US')}`}
      />
    </Stack>
  );
};
