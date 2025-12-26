import {
  Badge,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { ErrorAlert } from '@/components';

interface Invoice {
  id: number;
  invoiceNumber: string;
  client: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: string;
  paymentDate: string | null;
}

interface InvoicesTableProps {
  data?: Invoice[];
  loading?: boolean;
  error?: Error | null;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    paid: 'teal',
    pending: 'yellow',
    overdue: 'red',
  };
  return colors[status] || 'gray';
};

export const InvoicesTable: React.FC<InvoicesTableProps> = ({
  data = [],
  loading = false,
  error = null,
}) => {
  if (error) {
    return (
      <ErrorAlert
        title="Error loading invoices"
        message={error.message || 'Failed to load invoices'}
      />
    );
  }

  if (loading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`invoice-loading-${i}`} height={60} radius="sm" />
        ))}
      </Stack>
    );
  }

  const rows = data.map((invoice) => (
    <Table.Tr key={invoice.id}>
      <Table.Td>
        <Text size="sm" fw={500}>
          {invoice.invoiceNumber}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{invoice.client}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={600}>
          ${invoice.amount.toLocaleString('en-US')}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{new Date(invoice.issueDate).toLocaleDateString()}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{new Date(invoice.dueDate).toLocaleDateString()}</Text>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color={getStatusColor(invoice.status)}>
          {invoice.status}
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={700}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Invoice #</Table.Th>
            <Table.Th>Client</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Issue Date</Table.Th>
            <Table.Th>Due Date</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
