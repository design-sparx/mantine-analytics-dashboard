import { Text, Skeleton, Stack } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { ErrorAlert } from '@/components';

interface CampaignData {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface CampaignPerformanceChartProps {
  data?: CampaignData[];
  loading?: boolean;
  error?: Error | null;
}

export const CampaignPerformanceChart: React.FC<CampaignPerformanceChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading campaign data"
        message={error.message || 'Failed to load campaign performance'}
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
        Campaign Performance
      </Text>
      <LineChart
        h={300}
        data={data}
        dataKey="date"
        series={[
          { name: 'impressions', color: 'blue' },
          { name: 'clicks', color: 'teal' },
          { name: 'conversions', color: 'violet' },
        ]}
        curveType="natural"
        withLegend
        withTooltip
      />
    </>
  );
};
