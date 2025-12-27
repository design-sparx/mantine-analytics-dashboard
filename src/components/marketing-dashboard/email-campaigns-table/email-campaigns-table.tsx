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

interface EmailCampaign {
  id: number;
  campaignName: string;
  sentDate: string;
  recipients: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
  conversions: number;
}

interface EmailCampaignsTableProps {
  data?: EmailCampaign[];
  loading?: boolean;
  error?: Error | null;
}

export const EmailCampaignsTable: React.FC<EmailCampaignsTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading email campaigns"
        message={error.message || 'Failed to load email campaigns'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`email-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const rows = data.map((campaign) => (
    <Table.Tr key={campaign.id}>
      <Table.Td>
        <div>
          <Text size="sm" fw={500}>
            {campaign.campaignName}
          </Text>
          <Text size="xs" c="dimmed">
            {new Date(campaign.sentDate).toLocaleDateString()}
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{campaign.recipients.toLocaleString()}</Text>
      </Table.Td>
      <Table.Td>
        <Stack gap={4}>
          <Group gap={4} justify="space-between">
            <Text size="sm">{campaign.openRate.toFixed(1)}%</Text>
            <Text size="xs" c="dimmed">
              {campaign.opened.toLocaleString()}
            </Text>
          </Group>
          <Progress
            value={campaign.openRate}
            size="xs"
            color={campaign.openRate > 30 ? 'teal' : campaign.openRate > 20 ? 'blue' : 'orange'}
          />
        </Stack>
      </Table.Td>
      <Table.Td>
        <Stack gap={4}>
          <Group gap={4} justify="space-between">
            <Text size="sm">{campaign.clickRate.toFixed(1)}%</Text>
            <Text size="xs" c="dimmed">
              {campaign.clicked.toLocaleString()}
            </Text>
          </Group>
          <Progress
            value={campaign.clickRate}
            size="xs"
            color={campaign.clickRate > 10 ? 'violet' : campaign.clickRate > 5 ? 'grape' : 'pink'}
          />
        </Stack>
      </Table.Td>
      <Table.Td>
        <Badge
          variant="light"
          color={campaign.conversions > 150 ? 'teal' : campaign.conversions > 75 ? 'blue' : 'gray'}
        >
          {campaign.conversions}
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={700}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Campaign</Table.Th>
            <Table.Th>Recipients</Table.Th>
            <Table.Th>Open Rate</Table.Th>
            <Table.Th>Click Rate</Table.Th>
            <Table.Th>Conversions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
