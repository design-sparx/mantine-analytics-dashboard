import {
  Avatar,
  Badge,
  Button,
  Group,
  PaperProps,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconEdit, IconEye, IconMail, IconPhone } from '@tabler/icons-react';

import { Surface } from '@/components';
import type { CustomerDto, CustomerStatus } from '@/types';

interface CustomerCardProps extends Omit<PaperProps, 'children'> {
  data: CustomerDto;
  onEdit?: (customer: CustomerDto) => void;
  onView?: (customer: CustomerDto) => void;
}

export const CustomerCard = ({
  data,
  onEdit,
  onView,
  ...paperProps
}: CustomerCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status?: CustomerStatus): string => {
    if (!status) return 'gray';
    const statusMap: Record<number, string> = {
      1: 'green',  // Active
      2: 'gray',   // Inactive
      3: 'red',    // Blocked
    };
    return statusMap[status as number] || 'gray';
  };

  const getStatusLabel = (status?: CustomerStatus): string => {
    if (!status) return 'Unknown';
    const statusMap: Record<number, string> = {
      1: 'Active',
      2: 'Inactive',
      3: 'Blocked',
    };
    return statusMap[status as number] || 'Unknown';
  };

  return (
    <Surface p="md" {...paperProps}>
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <Avatar src={data.avatar} alt={data.name} radius="xl" size="lg" />
            <div>
              <Title order={5} mb={2}>
                {data.name || 'N/A'}
              </Title>
              {data.company && (
                <Text size="xs" c="dimmed">
                  {data.company}
                </Text>
              )}
            </div>
          </Group>
          <Badge
            color={getStatusColor(data.status)}
            variant="light"
            size="sm"
          >
            {getStatusLabel(data.status)}
          </Badge>
        </Group>

        <Stack gap={4}>
          <Group gap={6}>
            <IconMail size={14} color="gray" />
            <Text size="xs" c="dimmed">
              {data.email || 'N/A'}
            </Text>
          </Group>
          <Group gap={6}>
            <IconPhone size={14} color="gray" />
            <Text size="xs" c="dimmed">
              {data.phone || 'N/A'}
            </Text>
          </Group>
        </Stack>

        <Group justify="space-between" mt="xs">
          <div>
            <Text size="xs" c="dimmed">
              Total Orders
            </Text>
            <Text size="sm" fw={500}>
              {data.totalOrders || 0}
            </Text>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Text size="xs" c="dimmed">
              Total Spent
            </Text>
            <Text size="sm" fw={500}>
              {data.totalSpent ? formatCurrency(data.totalSpent) : '$0.00'}
            </Text>
          </div>
        </Group>

        <Group justify="flex-end" mt="md">
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconEye size={14} />}
            onClick={() => onView && onView(data)}
          >
            View
          </Button>
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconEdit size={14} />}
            onClick={() => onEdit && onEdit(data)}
          >
            Edit
          </Button>
        </Group>
      </Stack>
    </Surface>
  );
};
