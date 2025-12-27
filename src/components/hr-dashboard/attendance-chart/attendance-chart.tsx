import { LineChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface AttendanceData {
  month: string;
  present: number;
  leave: number;
  absent: number;
}

interface AttendanceChartProps {
  data?: AttendanceData[];
  loading?: boolean;
  error?: Error | null;
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading attendance data"
        message={error.message || 'Failed to load attendance data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={300} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        No attendance data available
      </Text>
    );
  }

  return (
    <LineChart
      h={300}
      data={data}
      dataKey="month"
      series={[
        { name: 'present', color: 'green', label: 'Present %' },
        { name: 'leave', color: 'blue', label: 'On Leave %' },
        { name: 'absent', color: 'red', label: 'Absent %' },
      ]}
      curveType="linear"
      tickLine="y"
      gridAxis="y"
      withLegend
      legendProps={{ verticalAlign: 'bottom' }}
    />
  );
};
