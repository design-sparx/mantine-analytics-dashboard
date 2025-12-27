import {
  Badge,
  Group,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { ErrorAlert } from '@/components';

interface Appointment {
  id: number;
  patientName: string;
  patientId: string;
  age: number;
  appointmentType: string;
  doctor: string;
  department: string;
  scheduledTime: string;
  status: string;
  priority: string;
}

interface PatientAppointmentsTableProps {
  data?: Appointment[];
  loading?: boolean;
  error?: Error | null;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'teal';
    case 'in-progress':
      return 'blue';
    case 'scheduled':
      return 'cyan';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'red';
    case 'high':
      return 'orange';
    case 'normal':
      return 'blue';
    case 'low':
      return 'gray';
    default:
      return 'gray';
  }
};

export const PatientAppointmentsTable: React.FC<PatientAppointmentsTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading appointments"
        message={error.message || 'Failed to load patient appointments'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`appointment-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const rows = data.map((appointment) => (
    <Table.Tr key={appointment.id}>
      <Table.Td>
        <div>
          <Text size="sm" fw={500}>
            {appointment.patientName}
          </Text>
          <Text size="xs" c="dimmed">
            {appointment.patientId} • Age {appointment.age}
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color="violet">
          {appointment.appointmentType}
        </Badge>
      </Table.Td>
      <Table.Td>
        <div>
          <Text size="sm">{appointment.doctor}</Text>
          <Text size="xs" c="dimmed">
            {appointment.department}
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Text size="sm">
          {new Date(appointment.scheduledTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Badge variant="light" color={getStatusColor(appointment.status)}>
            {appointment.status}
          </Badge>
          <Badge variant="dot" color={getPriorityColor(appointment.priority)}>
            {appointment.priority}
          </Badge>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={900}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Patient</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Doctor</Table.Th>
            <Table.Th>Time</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
