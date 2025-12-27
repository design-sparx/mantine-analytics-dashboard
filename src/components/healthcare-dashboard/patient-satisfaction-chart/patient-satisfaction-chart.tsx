import { Text, Skeleton, Stack } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { ErrorAlert } from '@/components';

interface SatisfactionData {
  month: string;
  overall: number;
  treatment: number;
  staff: number;
  facilities: number;
}

interface PatientSatisfactionChartProps {
  data?: SatisfactionData[];
  loading?: boolean;
  error?: Error | null;
}

export const PatientSatisfactionChart: React.FC<PatientSatisfactionChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading satisfaction data"
        message={error.message || 'Failed to load patient satisfaction'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        <Skeleton height={20} width="40%" radius="sm" />
        <Skeleton height={300} radius="sm" />
      </Stack>
    );
  }

  return (
    <>
      <Text size="lg" fw={600} mb="md">
        Patient Satisfaction Trends
      </Text>
      <LineChart
        h={300}
        data={data}
        dataKey="month"
        series={[
          { name: 'overall', label: 'Overall', color: 'blue' },
          { name: 'treatment', label: 'Treatment Quality', color: 'teal' },
          { name: 'staff', label: 'Staff Service', color: 'violet' },
          { name: 'facilities', label: 'Facilities', color: 'orange' },
        ]}
        curveType="natural"
        withLegend
        withTooltip
      />
    </>
  );
};
