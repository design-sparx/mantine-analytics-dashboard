import {
  Badge,
  Group,
  Progress,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react';
import { ErrorAlert } from '@/components';

interface SocialMedia {
  platform: string;
  followers: number;
  engagement: number;
  posts: number;
  reach: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface SocialMediaTableProps {
  data?: SocialMedia[];
  loading?: boolean;
  error?: Error | null;
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <IconTrendingUp size={16} color="var(--mantine-color-teal-6)" />;
    case 'down':
      return <IconTrendingDown size={16} color="var(--mantine-color-red-6)" />;
    default:
      return <IconMinus size={16} color="var(--mantine-color-gray-6)" />;
  }
};

export const SocialMediaTable: React.FC<SocialMediaTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading social media data"
        message={error.message || 'Failed to load social media stats'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`social-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const maxFollowers = Math.max(...data.map((s) => s.followers));

  const rows = data.map((social) => (
    <Table.Tr key={social.platform}>
      <Table.Td>
        <Badge variant="light" color={social.color}>
          {social.platform}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Stack gap={4}>
          <Text size="sm" fw={500}>
            {social.followers.toLocaleString()}
          </Text>
          <Progress
            value={(social.followers / maxFollowers) * 100}
            size="xs"
            color={social.color}
          />
        </Stack>
      </Table.Td>
      <Table.Td>
        <Group gap={4}>
          {getTrendIcon(social.trend)}
          <Text size="sm">{social.engagement}%</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{social.posts}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{(social.reach / 1000).toFixed(1)}K</Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={500}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Platform</Table.Th>
            <Table.Th>Followers</Table.Th>
            <Table.Th>Engagement</Table.Th>
            <Table.Th>Posts</Table.Th>
            <Table.Th>Reach</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
