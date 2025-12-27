import {
  Badge,
  Group,
  Progress,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { ErrorAlert } from '@/components';

interface ModelUsage {
  model: string;
  requests: number;
  tokens: number;
  avgLatency: number;
  successRate: number;
  cost: number;
}

interface ModelUsageTableProps {
  data?: ModelUsage[];
  loading?: boolean;
  error?: Error | null;
}

const getSuccessRateColor = (rate: number) => {
  if (rate >= 99) return 'green';
  if (rate >= 97) return 'teal';
  if (rate >= 95) return 'yellow';
  return 'orange';
};

export const ModelUsageTable: React.FC<ModelUsageTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading model usage"
        message={error.message || 'Failed to load model usage data'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`model-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const rows = data.map((model) => (
    <Table.Tr key={model.model}>
      <Table.Td>
        <Text size="sm" fw={500}>
          {model.model}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color="blue" size="lg">
          {(model.requests / 1000).toFixed(0)}K
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{(model.tokens / 1000000).toFixed(0)}M</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{model.avgLatency.toFixed(1)}s</Text>
      </Table.Td>
      <Table.Td>
        <div style={{ width: 120 }}>
          <Progress
            value={model.successRate}
            size="sm"
            color={getSuccessRateColor(model.successRate)}
          />
          <Text size="xs" c="dimmed" mt={4}>
            {model.successRate}%
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={600}>
          ${(model.cost / 1000).toFixed(1)}K
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={900}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Model</Table.Th>
            <Table.Th>Requests</Table.Th>
            <Table.Th>Tokens</Table.Th>
            <Table.Th>Avg Latency</Table.Th>
            <Table.Th>Success Rate</Table.Th>
            <Table.Th>Cost</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
