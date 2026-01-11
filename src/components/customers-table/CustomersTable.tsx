'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';

import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  MantineColor,
  MultiSelect,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconEdit, IconEye, IconSearch } from '@tabler/icons-react';
import sortBy from 'lodash/sortBy';
import {
  DataTable,
  DataTableProps,
  DataTableSortStatus,
} from 'mantine-datatable';

import { ErrorAlert } from '@/components';
import type { CustomerDto, CustomerStatus } from '@/types';

type StatusBadgeProps = {
  status?: CustomerStatus;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (!status)
    return (
      <Badge color="gray" variant="filled" radius="sm">
        Unknown
      </Badge>
    );

  const statusMap: Record<number, { label: string; color: MantineColor }> = {
    1: { label: 'Active', color: 'green' },
    2: { label: 'Inactive', color: 'gray' },
    3: { label: 'Blocked', color: 'red' },
  };

  const statusInfo = statusMap[status as number] || {
    label: 'Unknown',
    color: 'gray',
  };

  return (
    <Badge color={statusInfo.color} variant="filled" radius="sm">
      {statusInfo.label}
    </Badge>
  );
};

const PAGE_SIZES = [5, 10, 20];

type CustomersTableProps = {
  data: CustomerDto[];
  error?: ReactNode;
  loading?: boolean;
  onEdit?: (customer: CustomerDto) => void;
  onView?: (customer: CustomerDto) => void;
};

const CustomersTable = ({
  data = [],
  loading,
  error,
  onEdit,
  onView,
}: CustomersTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [selectedRecords, setSelectedRecords] = useState<CustomerDto[]>([]);
  const [records, setRecords] = useState<CustomerDto[]>(data.slice(0, pageSize));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<CustomerDto>>({
    columnAccessor: 'name',
    direction: 'asc',
  });
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const statuses = useMemo(() => {
    const statusMap: Record<number, string> = {
      1: 'Active',
      2: 'Inactive',
      3: 'Blocked',
    };
    const uniqueStatuses = new Set(
      data.map((e) => statusMap[e.status as number] || 'Unknown'),
    );
    return Array.from(uniqueStatuses);
  }, [data]);

  const formatCurrency = (amount?: number) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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

  const columns: DataTableProps<CustomerDto>['columns'] = [
    {
      accessor: 'name',
      sortable: true,
      filter: (
        <TextInput
          label="Customers"
          description="Show customers whose names include the specified text"
          placeholder="Search customers..."
          leftSection={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
      ),
      filtering: query !== '',
      render: (item: CustomerDto) => (
        <Group gap="sm">
          <Avatar src={item.avatar} alt={item.name} radius="xl" size="sm" />
          <div>
            <Text size="sm" fw={500}>
              {item.name || 'N/A'}
            </Text>
            {item.company && (
              <Text size="xs" c="dimmed">
                {item.company}
              </Text>
            )}
          </div>
        </Group>
      ),
    },
    {
      accessor: 'email',
      sortable: true,
    },
    {
      accessor: 'phone',
      title: 'Phone',
    },
    {
      accessor: 'totalOrders',
      title: 'Orders',
      sortable: true,
      render: (item: CustomerDto) => item.totalOrders || 0,
    },
    {
      accessor: 'totalSpent',
      title: 'Total Spent',
      sortable: true,
      render: (item: CustomerDto) => formatCurrency(item.totalSpent),
    },
    {
      accessor: 'status',
      render: (item: CustomerDto) => <StatusBadge status={item.status} />,
      filter: (
        <MultiSelect
          label="Status"
          description="Show all customers with status"
          data={statuses}
          value={selectedStatuses}
          placeholder="Search statuses…"
          onChange={setSelectedStatuses}
          leftSection={<IconSearch size={16} />}
          clearable
          searchable
        />
      ),
      filtering: selectedStatuses.length > 0,
    },
    {
      accessor: 'actions',
      title: 'Actions',
      textAlign: 'right',
      render: (item: CustomerDto) => (
        <Group gap="xs" justify="flex-end">
          {onView && (
            <Tooltip label="View">
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => onView(item)}
              >
                <IconEye size={16} />
              </ActionIcon>
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip label="Edit">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => onEdit(item)}
              >
                <IconEdit size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      ),
    },
  ];

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const d = sortBy(data, sortStatus.columnAccessor) as CustomerDto[];
    const dd = d.slice(from, to) as CustomerDto[];
    let filtered = sortStatus.direction === 'desc' ? dd.reverse() : dd;

    if (debouncedQuery || selectedStatuses.length) {
      filtered = data
        .filter(({ name, status }) => {
          if (
            debouncedQuery !== '' &&
            name &&
            !name.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
          ) {
            return false;
          }

          if (selectedStatuses.length && status) {
            const statusLabel = getStatusLabel(status);
            if (!selectedStatuses.includes(statusLabel)) {
              return false;
            }
          }
          return true;
        })
        .slice(from, to);
    }

    setRecords(filtered);
  }, [sortStatus, data, page, pageSize, debouncedQuery, selectedStatuses]);

  return error ? (
    <ErrorAlert title="Error loading customers" message={error.toString()} />
  ) : (
    <DataTable
      minHeight={200}
      verticalSpacing="sm"
      striped={true}
      columns={columns}
      records={records}
      selectedRecords={selectedRecords}
      onSelectedRecordsChange={setSelectedRecords}
      totalRecords={
        debouncedQuery || selectedStatuses.length > 0
          ? records.length
          : data.length
      }
      recordsPerPage={pageSize}
      page={page}
      onPageChange={(p) => setPage(p)}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      fetching={loading}
    />
  );
};

export default CustomersTable;
