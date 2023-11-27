'use client';

import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  DataTable,
  DataTableProps,
  DataTableSortStatus,
} from 'mantine-datatable';
import {
  Badge,
  MantineColor,
  MultiSelect,
  Text,
  TextInput,
} from '@mantine/core';
import sortBy from 'lodash/sortBy';
import { Orders, OrderStatus } from '@/types';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { ErrorAlert } from '@/components';

type StatusBadgeProps = {
  status: OrderStatus;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let color: MantineColor = '';

  switch (status) {
    case 'shipped':
      color = 'green';
      break;
    case 'processing':
      color = 'blue';
      break;
    case 'cancelled':
      color = 'orange';
      break;
    default:
      color = 'gray';
  }

  return (
    <Badge color={color} variant="filled" radius="sm">
      {status}
    </Badge>
  );
};

const PAGE_SIZES = [5, 10, 20];

type OrdersTableProps = {
  data: Orders[];
  error?: ReactNode;
  loading?: boolean;
};

const OrdersTable = ({ data, loading, error }: OrdersTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [selectedRecords, setSelectedRecords] = useState<Orders[]>([]);
  const [records, setRecords] = useState<Orders[]>(data.slice(0, pageSize));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'product',
    direction: 'asc',
  });
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const statuses = useMemo(() => {
    const statuses = new Set(data.map((e) => e.status));
    // @ts-ignore
    return [...statuses];
  }, [data]);

  const columns: DataTableProps<Orders>['columns'] = [
    {
      accessor: 'id',
      render: (item: Orders) => <span>#{item.id.slice(0, 7)}</span>,
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
    },
    {
      accessor: 'total',
      sortable: true,
      render: (item: Orders) => <span>${item.total}</span>,
    },
    {
      accessor: 'status',
      render: (item: Orders) => <StatusBadge status={item.status} />,
      filter: (
        <MultiSelect
          label="Status"
          description="Show all products with status"
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
      sortable: true,
    },
  ];

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const d = sortBy(data, sortStatus.columnAccessor) as Orders[];
    const dd = d.slice(from, to) as Orders[];
    let filtered = sortStatus.direction === 'desc' ? dd.reverse() : dd;

    if (debouncedQuery || selectedStatuses.length) {
      filtered = data
        .filter(({ product, status }) => {
          if (
            debouncedQuery !== '' &&
            !product.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
          ) {
            return false;
          }

          // @ts-ignore
          if (
            selectedStatuses.length &&
            !selectedStatuses.some((s) => s === status)
          ) {
            return false;
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
      // @ts-ignore
      columns={columns}
      records={records}
      selectedRecords={selectedRecords}
      // @ts-ignore
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
