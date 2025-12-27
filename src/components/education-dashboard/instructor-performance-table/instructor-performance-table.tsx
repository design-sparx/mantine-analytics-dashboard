import {
  Badge,
  Group,
  Skeleton,
  Stack,
  Table,
  Text,
  Rating,
} from '@mantine/core';
import { ErrorAlert } from '@/components';

interface Instructor {
  id: number;
  instructorName: string;
  department: string;
  coursesTeaching: number;
  totalStudents: number;
  averageRating: number;
  completionRate: number;
  responseTime: string;
  status: string;
}

interface InstructorPerformanceTableProps {
  data?: Instructor[];
  loading?: boolean;
  error?: Error | null;
}

export const InstructorPerformanceTable: React.FC<InstructorPerformanceTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading instructors"
        message={error.message || 'Failed to load instructor performance'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`instructor-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const rows = data.map((instructor) => (
    <Table.Tr key={instructor.id}>
      <Table.Td>
        <div>
          <Text size="sm" fw={500}>
            {instructor.instructorName}
          </Text>
          <Text size="xs" c="dimmed">
            {instructor.department}
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{instructor.coursesTeaching}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{instructor.totalStudents}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Rating value={instructor.averageRating} readOnly size="sm" />
          <Text size="xs" c="dimmed">
            {instructor.averageRating.toFixed(1)}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge
          variant="light"
          color={
            instructor.completionRate > 90
              ? 'teal'
              : instructor.completionRate > 85
                ? 'blue'
                : 'orange'
          }
        >
          {instructor.completionRate.toFixed(1)}%
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed">
          {instructor.responseTime}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={700}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Instructor</Table.Th>
            <Table.Th>Courses</Table.Th>
            <Table.Th>Students</Table.Th>
            <Table.Th>Rating</Table.Th>
            <Table.Th>Completion</Table.Th>
            <Table.Th>Response Time</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
