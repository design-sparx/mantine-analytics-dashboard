import { BarChart } from '@mantine/charts';
import { Skeleton, Text } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface RecruitmentStage {
  stage: string;
  count: number;
  color: string;
}

interface RecruitmentPipelineChartProps {
  data?: RecruitmentStage[];
  loading?: boolean;
  error?: Error | null;
}

export const RecruitmentPipelineChart: React.FC<RecruitmentPipelineChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading recruitment pipeline"
        message={error.message || 'Failed to load recruitment pipeline data'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={300} radius="sm" />;
  }

  if (!data || data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        No recruitment pipeline data available
      </Text>
    );
  }

  return (
    <BarChart
      h={300}
      data={data}
      dataKey="stage"
      series={[{ name: 'count', color: 'blue', label: 'Candidates' }]}
      tickLine="y"
      gridAxis="y"
      withLegend
    />
  );
};
