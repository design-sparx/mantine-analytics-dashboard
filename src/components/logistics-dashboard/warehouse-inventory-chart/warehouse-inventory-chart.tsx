import { BarChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface WarehouseInventory {
  warehouse: string;
  capacity: number;
  inbound: number;
  outbound: number;
  location: string;
}

interface WarehouseInventoryChartProps {
  data?: WarehouseInventory[];
  loading?: boolean;
  error?: Error | null;
}

export const WarehouseInventoryChart: React.FC<WarehouseInventoryChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading warehouse inventory"
        message={error.message || 'Failed to load warehouse inventory data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={300} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        No warehouse inventory data available
      </Text>
    );
  }

  return (
    <BarChart
      h={300}
      data={data}
      dataKey="warehouse"
      series={[
        { name: 'capacity', color: 'blue', label: 'Capacity %' },
        { name: 'inbound', color: 'green', label: 'Inbound' },
        { name: 'outbound', color: 'orange', label: 'Outbound' },
      ]}
      tickLine="y"
      gridAxis="y"
      withLegend
      legendProps={{ verticalAlign: 'bottom' }}
    />
  );
};
