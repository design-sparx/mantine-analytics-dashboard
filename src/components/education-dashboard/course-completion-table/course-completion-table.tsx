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

interface Course {
  id: number;
  courseName: string;
  courseCode: string;
  instructor: string;
  enrolledStudents: number;
  completedStudents: number;
  inProgress: number;
  dropped: number;
  completionRate: number;
  averageGrade: string;
  category: string;
}

interface CourseCompletionTableProps {
  data?: Course[];
  loading?: boolean;
  error?: Error | null;
}

export const CourseCompletionTable: React.FC<CourseCompletionTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading courses"
        message={error.message || 'Failed to load course completion data'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`course-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const rows = data.map((course) => (
    <Table.Tr key={course.id}>
      <Table.Td>
        <div>
          <Text size="sm" fw={500}>
            {course.courseName}
          </Text>
          <Text size="xs" c="dimmed">
            {course.courseCode} • {course.instructor}
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color="blue">
          {course.category}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{course.enrolledStudents}</Text>
      </Table.Td>
      <Table.Td>
        <Stack gap={4}>
          <Group gap={4} justify="space-between">
            <Text size="sm" fw={500}>
              {course.completionRate.toFixed(1)}%
            </Text>
            <Text size="xs" c="dimmed">
              {course.completedStudents}/{course.enrolledStudents}
            </Text>
          </Group>
          <Progress
            value={course.completionRate}
            size="xs"
            color={
              course.completionRate > 90
                ? 'teal'
                : course.completionRate > 80
                  ? 'blue'
                  : 'orange'
            }
          />
        </Stack>
      </Table.Td>
      <Table.Td>
        <Badge
          variant="light"
          color={
            course.averageGrade.includes('A')
              ? 'teal'
              : course.averageGrade.includes('B')
                ? 'blue'
                : 'orange'
          }
        >
          {course.averageGrade}
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={700}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Course</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Enrolled</Table.Th>
            <Table.Th>Completion Rate</Table.Th>
            <Table.Th>Avg Grade</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
