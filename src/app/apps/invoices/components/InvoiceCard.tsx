import {
  Badge,
  Button,
  Group,
  PaperProps,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconEdit, IconEye, IconFileText } from '@tabler/icons-react';

import { Surface } from '@/components';
import type { InvoiceDto } from '@/types';
import {
  getInvoiceStatusColor,
  getInvoiceStatusLabel,
} from '@/types/invoice';

interface InvoiceCardProps extends Omit<PaperProps, 'children'> {
  data: InvoiceDto;
  onEdit?: (invoice: InvoiceDto) => void;
  onView?: (invoice: InvoiceDto) => void;
}

export const InvoiceCard = ({
  data,
  onEdit,
  onView,
  ...paperProps
}: InvoiceCardProps) => {
  // Auth removed - all users can edit for demo purposes
  const isCreator = true;

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
            <Group gap="xs" align="center">
              <IconFileText size={16} />
              <Title order={5} mb={2}>
                {data?.id || `INV-${data?.id?.slice(-6)?.toUpperCase()}`}
              </Title>
            </Group>
            <Text size="sm" c="dimmed">
              Issued: {data?.issueDate && formatDate(data?.issueDate)}
            </Text>
          </div>
          <Badge
            color={getInvoiceStatusColor(data?.status!)}
            variant="light"
            size="sm"
          >
            {getInvoiceStatusLabel(data?.status!)}
          </Badge>
        </Group>

        <div>
          <Text size="sm" fw={500}>
            Customer: {data?.customerName || 'N/A'}
          </Text>
          {data?.customerEmail && (
            <Text size="xs" c="dimmed">
              {data.customerEmail}
            </Text>
          )}
        </div>

        <Group justify="space-between">
          <div>
            <Text size="xs" c="dimmed">
              Amount
            </Text>
            <Text size="sm" fw={500}>
              {data?.totalAmount ? formatCurrency(data?.totalAmount) : 'N/A'}
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
              isCreator
                ? 'Edit invoice'
                : 'Only the creator can edit this invoice'
            }
          >
            Edit
          </Button>
        </Group>
      </Stack>
    </Surface>
  );
};
