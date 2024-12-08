'use client';

import React, { ReactNode, useEffect, useState } from 'react';

import { Flex, Text, ThemeIcon } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import sortBy from 'lodash/sortBy';
import {
  DataTable,
  DataTableProps,
  DataTableSortStatus,
} from 'mantine-datatable';

import { IFile } from '@/app/apps/file-manager/types';
import { resolveFileIcon } from '@/app/apps/file-manager/utils';
import { ErrorAlert } from '@/components';

const PAGE_SIZES = [10, 15, 20];

type FilesTableProps = {
  data: IFile[];
  error?: ReactNode;
  loading?: boolean;
};

export function FilesTable({ data, loading, error }: FilesTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[2]);
  const [selectedRecords, setSelectedRecords] = useState<IFile[]>([]);
  const [records, setRecords] = useState<IFile[]>(data.slice(0, pageSize));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'product',
    direction: 'asc',
  });
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const columns: DataTableProps<IFile>['columns'] = [
    {
      accessor: 'name',
      render: (item: IFile) => {
        const Icon = resolveFileIcon(item.type);

        return (
          <Flex gap="xs" align="center">
            <ThemeIcon variant="default">
              <Icon size={16} />
            </ThemeIcon>
            <Text fz="sm">{item.name}</Text>
          </Flex>
        );
      },
    },
    {
      accessor: 'type',
    },
    {
      accessor: 'size',
    },
    {
      accessor: 'modified_at',
    },
    {
      accessor: 'owner',
    },
  ];

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const d = sortBy(data, sortStatus.columnAccessor) as IFile[];
    const dd = d.slice(from, to) as IFile[];
    let filtered = sortStatus.direction === 'desc' ? dd.reverse() : dd;

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
}
