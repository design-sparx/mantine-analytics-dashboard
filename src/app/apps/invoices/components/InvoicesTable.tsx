'use client';

import { useState } from 'react';

import {
  ActionIcon,
  Badge,
  Group,
  Menu,
  Pagination,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileText,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';

import type { InvoiceDto } from '@/types';
import {
  InvoiceStatus,
  getInvoiceStatusColor,
  getInvoiceStatusLabel,
} from '@/types/invoice';

interface InvoicesTableProps {
  data: InvoiceDto[];
  loading?: boolean;
  error?: string | null;
  onEdit?: (invoice: InvoiceDto) => void;
  onView?: (invoice: InvoiceDto) => void;
  onDelete?: (invoice: InvoiceDto) => void;
}

export const InvoicesTable = ({
  data = [],
  loading = false,
  error = null,
  onEdit,
  onView,
  onDelete,
}: InvoicesTableProps) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const itemsPerPage = 10;

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

  // Note: InvoiceDto doesn't have dueDate field in the current schema
  // Overdue status should be set on the backend based on business logic
  const isOverdue = (invoice: InvoiceDto) => {
    return invoice.status === InvoiceStatus.Overdue;
  };

  // Filter data based on search and status
  const filteredData = data.filter((invoice) => {
    const matchesSearch =
      invoice.id?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      invoice.customerName
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      invoice.customerEmail
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || invoice.status?.toString() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: InvoiceStatus.Draft.toString(), label: 'Draft' },
    { value: InvoiceStatus.Sent.toString(), label: 'Sent' },
    { value: InvoiceStatus.Refunded.toString(), label: 'Refunded' },
    { value: InvoiceStatus.PartiallyPaid.toString(), label: 'Partially Paid' },
    { value: InvoiceStatus.Paid.toString(), label: 'Paid' },
    { value: InvoiceStatus.Overdue.toString(), label: 'Overdue' },
    { value: InvoiceStatus.Cancelled.toString(), label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <Stack>
        <Text>Loading invoices...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack>
        <Text color="red">Error loading invoices: {error}</Text>
      </Stack>
    );
  }

  if (!data.length) {
    return (
      <Stack align="center" py="xl">
        <Text size="lg" c="dimmed">
          No invoices found
        </Text>
      </Stack>
    );
  }

  const rows = paginatedData.map((invoice) => {
    const isCreator = true; // Auth removed - all users can edit for demo purposes

    return (
      <Table.Tr key={invoice.id}>
        <Table.Td>
          <Group gap="xs">
            <IconFileText size={16} />
            <div>
              <Text fw={500} size="sm">
                {`INV-${invoice.id?.slice(-6)?.toUpperCase()}`}
              </Text>
              <Text size="xs" c="dimmed">
                {invoice.issueDate && formatDate(invoice.issueDate)}
              </Text>
            </div>
          </Group>
        </Table.Td>

        <Table.Td>
          <div>
            <Text size="sm" fw={500}>
              {invoice.customerName || 'N/A'}
            </Text>
            <Text size="xs" c="dimmed">
              {invoice.customerEmail || 'N/A'}
            </Text>
          </div>
        </Table.Td>

        <Table.Td>
          <Badge
            color={getInvoiceStatusColor(invoice.status!)}
            variant="light"
            size="sm"
          >
            {getInvoiceStatusLabel(invoice.status!)}
          </Badge>
          {isOverdue(invoice) && (
            <Text size="xs" c="red" mt={2}>
              Overdue
            </Text>
          )}
        </Table.Td>

        <Table.Td>
          <Text size="sm" fw={500}>
            {invoice.totalAmount ? formatCurrency(invoice.totalAmount) : 'N/A'}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text size="xs" c="dimmed">
            {invoice.createdBy || 'N/A'}
          </Text>
        </Table.Td>

        <Table.Td>
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={() => onView && onView(invoice)}
            >
              <IconEye size={16} />
            </ActionIcon>

            <Menu shadow="md" width={120}>
              <Menu.Target>
                <ActionIcon variant="subtle" size="sm">
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEye size={14} />}
                  onClick={() => onView && onView(invoice)}
                >
                  View
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => onEdit && onEdit(invoice)}
                  disabled={!isCreator}
                >
                  Edit
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={14} />}
                  onClick={() => onDelete && onDelete(invoice)}
                  disabled={!isCreator}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Stack>
      {/* Filters */}
      <Group>
        <TextInput
          placeholder="Search invoices..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filter by status"
          data={statusOptions}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value || 'all')}
          clearable={false}
          style={{ minWidth: 150 }}
        />
      </Group>

      {/* Table */}
      <ScrollArea>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Invoice #</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Created By</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Pagination */}
      {totalPages > 1 && (
        <Group justify="center">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
            size="sm"
          />
        </Group>
      )}

      {/* Results info */}
      <Text size="xs" c="dimmed" ta="center">
        Showing {startIndex + 1}-
        {Math.min(startIndex + itemsPerPage, filteredData.length)} of{' '}
        {filteredData.length} invoices
      </Text>
    </Stack>
  );
};
