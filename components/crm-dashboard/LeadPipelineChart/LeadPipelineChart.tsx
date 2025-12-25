import { Skeleton, Stack, Text, Progress, Group, Badge } from '@mantine/core';
import { ErrorAlert } from '@/components';

interface LeadStage {
  stage: string;
  count: number;
  value: number;
  percentage: number;
  color: string;
}

interface LeadPipelineChartProps {
  data?: LeadStage[];
  loading?: boolean;
  error?: Error | null;
}

export const LeadPipelineChart: React.FC<LeadPipelineChartProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading pipeline"
        message={error.message || 'Failed to load lead pipeline'}
      />
    );
  }

  if (loading) {
    return <Skeleton height={400} radius="sm" />;
  }

  const totalLeads = data.reduce((sum, item) => sum + item.count, 0);
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const maxCount = Math.max(...data.map((item) => item.count));

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <div>
          <Text size="lg" fw={600}>
            Lead Pipeline
          </Text>
          <Text size="sm" c="dimmed">
            {totalLeads.toLocaleString()} total leads • $
            {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} total value
          </Text>
        </div>
      </Group>

      <Stack gap="lg" mt="md">
        {data.map((stage, index) => (
          <div key={stage.stage}>
            <Group justify="space-between" mb={8}>
              <Group gap="xs">
                <Badge variant="light" color={stage.color} size="lg">
                  {stage.stage}
                </Badge>
                <Text size="sm" c="dimmed">
                  {stage.count} leads ({stage.percentage.toFixed(1)}%)
                </Text>
              </Group>
              <Text size="sm" fw={600}>
                ${stage.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </Group>
            <Progress
              value={(stage.count / maxCount) * 100}
              size="xl"
              color={stage.color}
              radius="md"
              animated={index < 6}
            />
          </div>
        ))}
      </Stack>
    </Stack>
  );
};
