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

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: string;
  driver: string;
  progress: number;
  eta: string;
  weight: string;
  type: string;
}

interface ActiveShipmentsTableProps {
  data?: Shipment[];
  loading?: boolean;
  error?: Error | null;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in transit':
      return 'blue';
    case 'loading':
      return 'cyan';
    case 'delayed':
      return 'red';
    case 'delivered':
      return 'green';
    default:
      return 'gray';
  }
};

const getTypeColor = (type: string) => {
  return type.toLowerCase() === 'express' ? 'violet' : 'gray';
};

export const ActiveShipmentsTable: React.FC<ActiveShipmentsTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading shipments"
        message={error.message || 'Failed to load active shipments'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`shipment-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const rows = data.map((shipment) => (
    <Table.Tr key={shipment.id}>
      <Table.Td>
        <Text size="sm" fw={500}>
          {shipment.id}
        </Text>
      </Table.Td>
      <Table.Td>
        <div>
          <Text size="sm">{shipment.origin}</Text>
          <Text size="xs" c="dimmed">
            {shipment.destination}
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color={getStatusColor(shipment.status)}>
          {shipment.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{shipment.driver}</Text>
      </Table.Td>
      <Table.Td>
        <div style={{ width: 100 }}>
          <Progress value={shipment.progress} size="sm" />
          <Text size="xs" c="dimmed" mt={4}>
            {shipment.progress}%
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Text size="sm">
          {new Date(shipment.eta).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Badge variant="outline" size="sm" color={getTypeColor(shipment.type)}>
            {shipment.type}
          </Badge>
          <Text size="xs" c="dimmed">
            {shipment.weight}
          </Text>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={1000}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Shipment ID</Table.Th>
            <Table.Th>Route</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Driver</Table.Th>
            <Table.Th>Progress</Table.Th>
            <Table.Th>ETA</Table.Th>
            <Table.Th>Details</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
