import {
  Badge,
  Button,
  Group,
  PaperProps,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconEdit, IconEye } from '@tabler/icons-react';

import { Surface } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import {
  IOrder,
  getOrderStatusColor,
  getOrderStatusLabel,
} from '@/types/order';

interface OrderCardProps extends Omit<PaperProps, 'children'> {
  data: IOrder;
  onEdit?: (order: IOrder) => void;
  onView?: (order: IOrder) => void;
}

export const OrderCard = ({
  data,
  onEdit,
  onView,
  ...paperProps
}: OrderCardProps) => {
  const { user } = useAuth();
  const isCreator = user?.id === data.createdById;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Surface p="md" {...paperProps}>
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={5} mb={4}>
              Order #{data.id?.slice(-8)?.toUpperCase()}
            </Title>
            <Text size="sm" c="dimmed">
              {data.createdAt && formatDate(data.createdAt)}
            </Text>
          </div>
          <Badge
            color={getOrderStatusColor(data.status)}
            variant="light"
            size="sm"
          >
            {getOrderStatusLabel(data.status)}
          </Badge>
        </Group>

        <div>
          <Text size="sm" fw={500}>
            Customer: {data.customerName || 'N/A'}
          </Text>
          {data.customerEmail && (
            <Text size="xs" c="dimmed">
              {data.customerEmail}
            </Text>
          )}
        </div>

        <Group justify="space-between">
          <div>
            <Text size="xs" c="dimmed">
              Items
            </Text>
            <Text size="sm" fw={500}>
              {data.orderItems?.length || 0}
            </Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Total
            </Text>
            <Text size="sm" fw={500}>
              {data.totalAmount ? formatCurrency(data.totalAmount) : 'N/A'}
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
            disabled={!isCreator}
            title={
              isCreator ? 'Edit order' : 'Only the creator can edit this order'
            }
          >
            Edit
          </Button>
        </Group>
      </Stack>
    </Surface>
  );
};
