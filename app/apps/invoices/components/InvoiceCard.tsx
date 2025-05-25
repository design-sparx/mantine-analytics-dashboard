import {
  Badge,
  Button,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconEdit, IconEye, IconFileText } from '@tabler/icons-react';

import { useAuth } from '@/hooks/useAuth';
import {
  IInvoice,
  getInvoiceStatusColor,
  getInvoiceStatusLabel,
} from '@/types/invoice';

interface InvoiceCardProps extends Omit<PaperProps, 'children'> {
  data: IInvoice;
  onEdit?: (invoice: IInvoice) => void;
  onView?: (invoice: IInvoice) => void;
}

export const InvoiceCard = ({
  data,
  onEdit,
  onView,
  ...paperProps
}: InvoiceCardProps) => {
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

  const isOverdue = () => {
    if (!data.dueDate) return false;
    return new Date(data.dueDate) < new Date() && data.status !== 5; // Not paid
  };

  return (
    <Paper p="md" withBorder {...paperProps}>
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="xs" align="center">
              <IconFileText size={16} />
              <Title order={5} mb={2}>
                {data.invoiceNumber ||
                  `INV-${data.id?.slice(-6)?.toUpperCase()}`}
              </Title>
            </Group>
            <Text size="sm" c="dimmed">
              Issued: {data.issueDate && formatDate(data.issueDate)}
            </Text>
            {data.dueDate && (
              <Text size="sm" c={isOverdue() ? 'red' : 'dimmed'}>
                Due: {formatDate(data.dueDate)}
              </Text>
            )}
          </div>
          <Badge
            color={getInvoiceStatusColor(data.status)}
            variant="light"
            size="sm"
          >
            {getInvoiceStatusLabel(data.status)}
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
              {data.invoiceItems?.length || 0}
            </Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Amount
            </Text>
            <Text size="sm" fw={500}>
              {data.totalAmount ? formatCurrency(data.totalAmount) : 'N/A'}
            </Text>
          </div>
        </Group>

        {isOverdue() && (
          <Text size="xs" c="red" fw={500}>
            ⚠️ Overdue
          </Text>
        )}

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
    </Paper>
  );
};
