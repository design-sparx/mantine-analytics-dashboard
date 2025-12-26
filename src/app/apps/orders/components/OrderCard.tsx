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
import type { OrderDto, OrderStatus, PaymentMethod } from '@/types';

interface OrderCardProps extends Omit<PaperProps, 'children'> {
  data: OrderDto;
  onEdit?: (order: OrderDto) => void;
  onView?: (order: OrderDto) => void;
}

export const OrderCard = ({
  data,
  onEdit,
  onView,
  ...paperProps
}: OrderCardProps) => {
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

  const getStatusColor = (status?: OrderStatus): string => {
    if (!status) return 'gray';
    // Map numeric status to colors
    const statusMap: Record<number, string> = {
      1: 'yellow',   // Pending
      2: 'blue',     // Processing
      3: 'orange',   // Shipped
      4: 'green',    // Delivered
      5: 'red',      // Cancelled
    };
    return statusMap[status as number] || 'gray';
  };

  const getStatusLabel = (status?: OrderStatus): string => {
    if (!status) return 'Unknown';
    const statusMap: Record<number, string> = {
      1: 'Pending',
      2: 'Processing',
      3: 'Shipped',
      4: 'Delivered',
      5: 'Cancelled',
    };
    return statusMap[status as number] || 'Unknown';
  };

  const getPaymentMethodLabel = (method?: PaymentMethod): string => {
    if (!method) return 'N/A';
    const methodMap: Record<number, string> = {
      1: 'Credit Card',
      2: 'Debit Card',
      3: 'PayPal',
      4: 'Cash',
      5: 'Bank Transfer',
    };
    return methodMap[method as number] || 'Other';
  };

  return (
    <Surface p="md" {...paperProps}>
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={5} mb={4}>
              Order #{data.id?.slice(-8)?.toUpperCase() || 'N/A'}
            </Title>
            <Text size="sm" c="dimmed">
              {data.date && formatDate(data.date)}
            </Text>
          </div>
          <Badge
            color={getStatusColor(data.status)}
            variant="light"
            size="sm"
          >
            {getStatusLabel(data.status)}
          </Badge>
        </Group>

        <div>
          <Text size="sm" fw={500}>
            Product: {data.product || 'N/A'}
          </Text>
          <Text size="xs" c="dimmed">
            Payment: {getPaymentMethodLabel(data.payment_method)}
          </Text>
        </div>

        <Group justify="space-between">
          <div>
            <Text size="xs" c="dimmed">
              Total
            </Text>
            <Text size="sm" fw={500}>
              {data.total ? formatCurrency(data.total) : 'N/A'}
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
