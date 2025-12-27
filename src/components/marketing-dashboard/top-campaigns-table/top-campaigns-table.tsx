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

interface Campaign {
  id: number;
  name: string;
  type: string;
  budget: number;
  spent: number;
  roi: number;
  impressions: number;
  conversions: number;
  status: string;
}

interface TopCampaignsTableProps {
  data?: Campaign[];
  loading?: boolean;
  error?: Error | null;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'teal';
    case 'paused':
      return 'orange';
    case 'completed':
      return 'blue';
    default:
      return 'gray';
  }
};

export const TopCampaignsTable: React.FC<TopCampaignsTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading campaigns"
        message={error.message || 'Failed to load top campaigns'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`campaign-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const rows = data.map((campaign) => {
    const budgetUsed = (campaign.spent / campaign.budget) * 100;

    return (
      <Table.Tr key={campaign.id}>
        <Table.Td>
          <div>
            <Text size="sm" fw={500}>
              {campaign.name}
            </Text>
            <Badge size="xs" variant="dot" color="gray">
              {campaign.type}
            </Badge>
          </div>
        </Table.Td>
        <Table.Td>
          <Stack gap={4}>
            <Group gap={4} justify="space-between">
              <Text size="sm">${campaign.spent.toLocaleString()}</Text>
              <Text size="xs" c="dimmed">
                / ${campaign.budget.toLocaleString()}
              </Text>
            </Group>
            <Progress
              value={budgetUsed}
              size="xs"
              color={budgetUsed > 90 ? 'red' : budgetUsed > 75 ? 'orange' : 'teal'}
            />
          </Stack>
        </Table.Td>
        <Table.Td>
          <Badge
            variant="light"
            color={campaign.roi > 300 ? 'teal' : campaign.roi > 200 ? 'blue' : 'violet'}
          >
            {campaign.roi}%
          </Badge>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{(campaign.impressions / 1000).toFixed(1)}K</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" fw={500}>
            {campaign.conversions.toLocaleString()}
          </Text>
        </Table.Td>
        <Table.Td>
          <Badge variant="light" color={getStatusColor(campaign.status)}>
            {campaign.status}
          </Badge>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table.ScrollContainer minWidth={900}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Campaign</Table.Th>
            <Table.Th>Budget</Table.Th>
            <Table.Th>ROI</Table.Th>
            <Table.Th>Impressions</Table.Th>
            <Table.Th>Conversions</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
