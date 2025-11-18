'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';

import {
  ActionIcon,
  Avatar,
  Badge,
  Flex,
  Group,
  HoverCard,
  MantineColor,
  MultiSelect,
  Stack,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconCloudDownload, IconEye, IconSearch } from '@tabler/icons-react';
import sortBy from 'lodash/sortBy';
import {
  DataTable,
  DataTableProps,
  DataTableSortStatus,
} from 'mantine-datatable';
import { useRouter } from 'next/navigation';

import { ErrorAlert } from '@/components';
import { PATH_INVOICES } from '@/routes';

import { InvoiceStatus, InvoiceTableRow } from './types';

const PAGE_SIZES = [5, 10, 20];

const ICON_SIZE = 18;

type StatusBadgeProps = {
  status: InvoiceStatus;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let color: MantineColor = '';

  switch (status) {
    case 'sent':
      color = 'blue';
      break;
    case 'suspended':
      color = 'gray';
      break;
    case 'cancelled':
      color = 'red';
      break;
    case 'approved':
      color = 'green.8';
      break;
    case 'pending':
      color = 'cyan.7';
      break;
    default:
      color = 'dark';
  }

  return (
    <Badge color={color} variant="filled" radius="sm">
      {status}
    </Badge>
  );
};

type InvoicesTableProps = {
  data: InvoiceTableRow[];
  error?: ReactNode;
  loading?: boolean;
};

const InvoicesTable = ({ data, error, loading }: InvoicesTableProps) => {
  const theme = useMantineTheme();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [selectedRecords, setSelectedRecords] = useState<InvoiceTableRow[]>([]);
  const [records, setRecords] = useState<InvoiceTableRow[]>(data.slice(0, pageSize));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<InvoiceTableRow>>({
    columnAccessor: 'full_name',
    direction: 'asc',
  });
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const router = useRouter();
  const statuses = useMemo(() => {
    const statusSet = new Set(data.map((e) => e.status));
    return Array.from(statusSet);
  }, [data]);

  const columns: DataTableProps<InvoiceTableRow>['columns'] = [
    {
      accessor: 'full_name',
      title: 'Customer',
      render: ({ full_name, email }: InvoiceTableRow) => {
        const firstName = full_name.split(' ')[0],
          lastName = full_name.split(' ')[1];

        return (
          <HoverCard shadow="md" openDelay={500} closeDelay={500}>
            <HoverCard.Target>
              <Flex component={UnstyledButton} gap="xs" align="center">
                <Avatar
                  src={null}
                  alt={`${firstName} ${lastName}`}
                  variant="filled"
                  radius="xl"
                  color={theme.colors[theme.primaryColor][7]}
                >
                  {`${Array.from(firstName)[0]}`}
                  {`${Array.from(lastName)[0]}`}
                </Avatar>
                <Stack gap={1}>
                  <Text fw={600}>{full_name}</Text>
                  <Text fz="sm">{email}</Text>
                </Stack>
              </Flex>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Stack gap="xs">
                <Text fz="sm">First name: {firstName}</Text>
                <Text fz="sm">Last name: {lastName}</Text>
                <Text fz="sm">Email: {email}</Text>
              </Stack>
            </HoverCard.Dropdown>
          </HoverCard>
        );
      },
      sortable: true,
      filter: (
        <TextInput
          label="Customer"
          description="Show customer whose names include the specified text"
          placeholder="Search customer..."
          leftSection={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
      ),
      filtering: query !== '',
    },
    {
      accessor: 'status',
      render: (item: InvoiceTableRow) => <StatusBadge status={item.status} />,
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
      accessor: 'id',
      render: (item: InvoiceTableRow) => <Text>#{item.id.slice(0, 7)}</Text>,
    },
    {
      accessor: 'amount',
      sortable: true,
      render: (item: InvoiceTableRow) => <Text>${item.amount}</Text>,
    },
    {
      accessor: 'issue_date',
    },
    {
      accessor: '',
      title: 'Actions',
      render: (item: InvoiceTableRow) => (
        <Group gap="sm">
          <Tooltip label="Download invoice">
            <ActionIcon>
              <IconCloudDownload size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="View invoice details">
            <ActionIcon
              onClick={() =>
                router.push(PATH_INVOICES.invoices.invoice_details(item.id))
              }
            >
              <IconEye size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
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
    const sorted = sortBy(data, sortStatus.columnAccessor) as InvoiceTableRow[];
    const sortedData = sortStatus.direction === 'desc' ? sorted.reverse() : sorted;
    let filtered = sortedData.slice(from, to);

    if (debouncedQuery || selectedStatuses.length) {
      filtered = data
        .filter(({ full_name, status }) => {
          if (
            debouncedQuery !== '' &&
            !full_name
              .toLowerCase()
              .includes(debouncedQuery.trim().toLowerCase())
          ) {
            return false;
          }

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
    <ErrorAlert title="Error loading invoices" message={error.toString()} />
  ) : (
    <DataTable<InvoiceTableRow>
      minHeight={200}
      verticalSpacing="xs"
      striped
      highlightOnHover
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

export default InvoicesTable;
