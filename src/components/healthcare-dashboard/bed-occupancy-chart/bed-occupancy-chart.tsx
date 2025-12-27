import { Skeleton, Stack } from '@mantine/core';
import { BarChart } from '@mantine/charts';
import { ErrorAlert } from '@/components';

interface BedOccupancy {
  department: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyRate: number;
  criticalPatients: number;
  color: string;
}

interface BedOccupancyChartProps {
  data?: BedOccupancy[];
  loading?: boolean;
  error?: Error | null;
}

export const BedOccupancyChart: React.FC<BedOccupancyChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading bed occupancy"
        message={error.message || 'Failed to load bed occupancy data'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        <Skeleton height={300} radius="sm" />
      </Stack>
    );
  }

  return (
    <BarChart
      h={300}
      data={data}
      dataKey="department"
      series={[
        { name: 'occupiedBeds', label: 'Occupied', color: 'blue' },
        { name: 'availableBeds', label: 'Available', color: 'teal' },
      ]}
      withLegend
      withTooltip
    />
  );
};
