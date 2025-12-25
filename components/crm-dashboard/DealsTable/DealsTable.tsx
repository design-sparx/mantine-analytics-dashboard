import {
  Avatar,
  Badge,
  Group,
  Progress,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { ErrorAlert } from '@/components';

interface Deal {
  id: number;
  company: string;
  contact: string;
  email: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  lastActivity: string;
}

interface DealsTableProps {
  data?: Deal[];
  loading?: boolean;
  error?: Error | null;
}

const getStageColor = (stage: string) => {
  const colors: Record<string, string> = {
    'New Lead': 'blue',
    'Contacted': 'cyan',
    'Qualified': 'violet',
    'Proposal': 'grape',
    'Negotiation': 'pink',
    'Closed Won': 'teal',
    'Closed Lost': 'red',
  };
  return colors[stage] || 'gray';
};

const getProbabilityColor = (probability: number) => {
  if (probability >= 75) return 'teal';
  if (probability >= 50) return 'yellow';
  if (probability >= 25) return 'orange';
  return 'red';
};

export const DealsTable: React.FC<DealsTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading deals"
        message={error.message || 'Failed to load deals'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`deal-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const rows = data.map((deal) => (
    <Table.Tr key={deal.id}>
      <Table.Td>
        <div>
          <Text size="sm" fw={500}>
            {deal.company}
          </Text>
          <Text size="xs" c="dimmed">
            {deal.contact}
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={600}>
          ${deal.value.toLocaleString('en-US')}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color={getStageColor(deal.stage)}>
          {deal.stage}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Stack gap={4}>
          <Group gap="xs">
            <Progress
              value={deal.probability}
              size="sm"
              color={getProbabilityColor(deal.probability)}
              style={{ flex: 1 }}
            />
            <Text size="xs" c="dimmed" style={{ minWidth: 35 }}>
              {deal.probability}%
            </Text>
          </Group>
        </Stack>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{new Date(deal.expectedCloseDate).toLocaleDateString()}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Avatar size={24} radius="xl" color="blue">
            {deal.assignedTo
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </Avatar>
          <Text size="sm">{deal.assignedTo}</Text>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={900}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Company</Table.Th>
            <Table.Th>Deal Value</Table.Th>
            <Table.Th>Stage</Table.Th>
            <Table.Th>Probability</Table.Th>
            <Table.Th>Expected Close</Table.Th>
            <Table.Th>Assigned To</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
