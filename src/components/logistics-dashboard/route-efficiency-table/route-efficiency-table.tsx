import {
  Badge,
  Progress,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { ErrorAlert } from '@/components';

interface RouteEfficiency {
  route: string;
  efficiency: number;
  avgTime: string;
  shipments: number;
  fuelCost: string;
}

interface RouteEfficiencyTableProps {
  data?: RouteEfficiency[];
  loading?: boolean;
  error?: Error | null;
}

const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 95) return 'green';
  if (efficiency >= 90) return 'teal';
  if (efficiency >= 85) return 'yellow';
  return 'orange';
};

export const RouteEfficiencyTable: React.FC<RouteEfficiencyTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading route efficiency"
        message={error.message || 'Failed to load route efficiency data'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`route-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const rows = data.map((route) => (
    <Table.Tr key={route.route}>
      <Table.Td>
        <Text size="sm" fw={500}>
          {route.route}
        </Text>
      </Table.Td>
      <Table.Td>
        <div style={{ width: 150 }}>
          <Progress
            value={route.efficiency}
            size="lg"
            color={getEfficiencyColor(route.efficiency)}
          />
          <Text size="xs" c="dimmed" mt={4}>
            {route.efficiency}%
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{route.avgTime}</Text>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color="blue">
          {route.shipments.toLocaleString()}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={500}>
          {route.fuelCost}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={700}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Route</Table.Th>
            <Table.Th>Efficiency</Table.Th>
            <Table.Th>Avg Time</Table.Th>
            <Table.Th>Shipments</Table.Th>
            <Table.Th>Fuel Cost</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
