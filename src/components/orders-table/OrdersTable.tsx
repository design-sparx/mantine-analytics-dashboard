'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';

import {
  ActionIcon,
  Badge,
  Group,
  MantineColor,
  MultiSelect,
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
import type { OrderDto, OrderStatus, PaymentMethod } from '@/types';

type StatusBadgeProps = {
  status?: OrderStatus;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (!status)
    return (
      <Badge color="gray" variant="filled" radius="sm">
        Unknown
      </Badge>
    );

  const statusMap: Record<number, { label: string; color: MantineColor }> = {
    1: { label: 'Pending', color: 'yellow' },
    2: { label: 'Processing', color: 'blue' },
    3: { label: 'Shipped', color: 'orange' },
    4: { label: 'Delivered', color: 'green' },
    5: { label: 'Cancelled', color: 'red' },
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

type OrdersTableProps = {
  data: OrderDto[];
  error?: ReactNode;
  loading?: boolean;
  onEdit?: (order: OrderDto) => void;
  onView?: (order: OrderDto) => void;
};

const OrdersTable = ({
  data = [],
  loading,
  error,
  onEdit,
  onView,
}: OrdersTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [selectedRecords, setSelectedRecords] = useState<OrderDto[]>([]);
  const [records, setRecords] = useState<OrderDto[]>(data.slice(0, pageSize));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<OrderDto>>({
    columnAccessor: 'product',
    direction: 'asc',
  });
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const statuses = useMemo(() => {
    const statusMap: Record<number, string> = {
      1: 'Pending',
      2: 'Processing',
      3: 'Shipped',
      4: 'Delivered',
      5: 'Cancelled',
    };
    const uniqueStatuses = new Set(
      data.map((e) => statusMap[e.status as number] || 'Unknown'),
    );
    return Array.from(uniqueStatuses);
  }, [data]);

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  const columns: DataTableProps<OrderDto>['columns'] = [
    {
      accessor: 'id',
      title: 'Order ID',
      render: (item: OrderDto) => (
        <span>#{item.id?.slice(-8)?.toUpperCase() || 'N/A'}</span>
      ),
    },
    {
      accessor: 'product',
      sortable: true,
      filter: (
        <TextInput
          label="Products"
          description="Show products whose names include the specified text"
          placeholder="Search products..."
          leftSection={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
      ),
      filtering: query !== '',
    },
    {
      accessor: 'date',
      sortable: true,
      render: (item: OrderDto) =>
        item.date ? formatDate(item.date ?? '') : '----',
    },
    {
      accessor: 'total',
      sortable: true,
      render: (item: OrderDto) => formatCurrency(item.total),
    },
    {
      accessor: 'status',
      render: (item: OrderDto) => <StatusBadge status={item.status} />,
      filter: (
        <MultiSelect
          label="Status"
          description="Show all orders with status"
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
      accessor: 'payment_method',
      title: 'Payment Method',
      sortable: true,
      render: (item: OrderDto) => getPaymentMethodLabel(item.payment_method),
    },
    {
      accessor: 'actions',
      title: 'Actions',
      textAlign: 'right',
      render: (item: OrderDto) => (
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
    const d = sortBy(data, sortStatus.columnAccessor) as OrderDto[];
    const dd = d.slice(from, to) as OrderDto[];
    let filtered = sortStatus.direction === 'desc' ? dd.reverse() : dd;

    if (debouncedQuery || selectedStatuses.length) {
      filtered = data
        .filter(({ product, status }) => {
          if (
            debouncedQuery !== '' &&
            product &&
            !product.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
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
    <ErrorAlert title="Error loading orders" message={error.toString()} />
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

export default OrdersTable;
