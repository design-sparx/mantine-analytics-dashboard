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

interface LocationAnalytics {
  location: string;
  properties: number;
  avgPrice: number;
  growth: number;
  occupancy: number;
}

interface LocationAnalyticsTableProps {
  data?: LocationAnalytics[];
  loading?: boolean;
  error?: Error | null;
}

const getGrowthColor = (growth: number) => {
  if (growth >= 10) return 'green';
  if (growth >= 5) return 'teal';
  if (growth >= 0) return 'blue';
  return 'red';
};

export const LocationAnalyticsTable: React.FC<LocationAnalyticsTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading location analytics"
        message={error.message || 'Failed to load location analytics'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`location-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const rows = data.map((location, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Text size="sm" fw={500}>
          {location.location}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color="blue">
          {location.properties}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={600}>
          ${(location.avgPrice / 1000).toFixed(0)}K
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Badge variant="light" color={getGrowthColor(location.growth)}>
            {location.growth > 0 ? '+' : ''}{location.growth}%
          </Badge>
        </Group>
      </Table.Td>
      <Table.Td>
        <div style={{ width: 120 }}>
          <Progress value={location.occupancy} size="sm" color="teal" />
          <Text size="xs" c="dimmed" mt={4}>
            {location.occupancy}%
          </Text>
        </div>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={700}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Location</Table.Th>
            <Table.Th>Properties</Table.Th>
            <Table.Th>Avg Price</Table.Th>
            <Table.Th>Growth</Table.Th>
            <Table.Th>Occupancy</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
