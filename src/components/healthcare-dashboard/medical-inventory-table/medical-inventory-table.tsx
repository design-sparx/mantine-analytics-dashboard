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

interface InventoryItem {
  id: number;
  itemName: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  maxStock: number;
  unitPrice: number;
  status: string;
  lastRestocked: string;
  supplier: string;
}

interface MedicalInventoryTableProps {
  data?: InventoryItem[];
  loading?: boolean;
  error?: Error | null;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'adequate':
      return 'teal';
    case 'low':
      return 'orange';
    case 'critical':
      return 'red';
    default:
      return 'gray';
  }
};

export const MedicalInventoryTable: React.FC<MedicalInventoryTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading inventory"
        message={error.message || 'Failed to load medical inventory'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`inventory-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const rows = data.map((item) => {
    const stockPercentage = (item.currentStock / item.maxStock) * 100;

    return (
      <Table.Tr key={item.id}>
        <Table.Td>
          <div>
            <Text size="sm" fw={500}>
              {item.itemName}
            </Text>
            <Badge size="xs" variant="dot" color="gray">
              {item.category}
            </Badge>
          </div>
        </Table.Td>
        <Table.Td>
          <Stack gap={4}>
            <Group gap={4} justify="space-between">
              <Text size="sm" fw={500}>
                {item.currentStock}
              </Text>
              <Text size="xs" c="dimmed">
                / {item.maxStock}
              </Text>
            </Group>
            <Progress
              value={stockPercentage}
              size="xs"
              color={
                item.currentStock < item.minimumStock
                  ? 'red'
                  : item.currentStock < item.minimumStock * 1.5
                    ? 'orange'
                    : 'teal'
              }
            />
          </Stack>
        </Table.Td>
        <Table.Td>
          <Badge variant="light" color={getStatusColor(item.status)}>
            {item.status}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Text size="sm">${item.unitPrice.toFixed(2)}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="xs" c="dimmed">
            {new Date(item.lastRestocked).toLocaleDateString()}
          </Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table.ScrollContainer minWidth={700}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Item</Table.Th>
            <Table.Th>Stock Level</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Unit Price</Table.Th>
            <Table.Th>Last Restocked</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
