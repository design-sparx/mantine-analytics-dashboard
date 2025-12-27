import {
  Badge,
  Group,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { ErrorAlert } from '@/components';

interface Position {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  applicants: number;
  daysOpen: number;
  priority: string;
}

interface OpenPositionsTableProps {
  data?: Position[];
  loading?: boolean;
  error?: Error | null;
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'red';
    case 'medium':
      return 'yellow';
    case 'low':
      return 'blue';
    default:
      return 'gray';
  }
};

const getTypeColor = (type: string) => {
  return type.toLowerCase() === 'full-time' ? 'blue' : 'cyan';
};

export const OpenPositionsTable: React.FC<OpenPositionsTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading positions"
        message={error.message || 'Failed to load open positions'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`position-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const rows = data.map((position) => (
    <Table.Tr key={position.id}>
      <Table.Td>
        <div>
          <Text size="sm" fw={500}>
            {position.title}
          </Text>
          <Text size="xs" c="dimmed">
            {position.department}
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{position.location}</Text>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color={getTypeColor(position.type)}>
          {position.type}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge variant="filled" color="blue" size="lg">
          {position.applicants}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{position.daysOpen} days</Text>
      </Table.Td>
      <Table.Td>
        <Badge variant="dot" color={getPriorityColor(position.priority)}>
          {position.priority}
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={900}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Position</Table.Th>
            <Table.Th>Location</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Applicants</Table.Th>
            <Table.Th>Days Open</Table.Th>
            <Table.Th>Priority</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
