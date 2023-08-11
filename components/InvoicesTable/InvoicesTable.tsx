import React, {useEffect, useMemo, useState} from 'react';
import {DataTable, DataTableSortStatus} from "mantine-datatable";
import {
    ActionIcon,
    Avatar,
    Badge,
    Flex,
    Group,
    MantineColor,
    MultiSelect,
    Stack,
    Text,
    TextInput,
    Tooltip, useMantineTheme
} from "@mantine/core"
import sortBy from 'lodash/sortBy';
import {Invoices, InvoiceStatus} from "@/types";
import {useDebouncedValue} from "@mantine/hooks";
import {IconCloudDownload, IconEye, IconSearch} from "@tabler/icons-react";
import {useRouter} from "next/router";
import {PATH_INVOICES} from "@/routes";

const PAGE_SIZES = [10, 15, 20];

const ICON_SIZE = 18;

type StatusBadgeProps = {
    status: InvoiceStatus
}

const StatusBadge = ({status}: StatusBadgeProps) => {
    let color: MantineColor = '';

    switch (status) {
        case 'sent':
            color = "blue"
            break;
        case 'suspended':
            color = "gray"
            break;
        case 'cancelled':
            color = "red"
            break;
        case 'approved':
            color = "green.8"
            break;
        case 'pending':
            color = "cyan.7"
            break;
        default:
            color = "dark"
    }

    return (
        <Badge color={color} variant="filled" radius="sm">{status}</Badge>
    )
}

type InvoicesTableProps = {
    data: Invoices[]
}

const InvoicesTable = ({data}: InvoicesTableProps) => {
    const theme = useMantineTheme()
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [selectedRecords, setSelectedRecords] = useState<Invoices[]>([]);
    const [records, setRecords] = useState<Invoices[]>(data.slice(0, pageSize));
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({columnAccessor: 'full_name', direction: 'asc'});
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebouncedValue(query, 200);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const router = useRouter()
    const statuses = useMemo(() => {
        const statuses = new Set(data.map((e) => e.status));
        // @ts-ignore
        return [...statuses];
    }, [data]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        const d = sortBy(data, sortStatus.columnAccessor) as Invoices[];
        const dd = d.slice(from, to) as Invoices[];
        let filtered = sortStatus.direction === 'desc' ? dd.reverse() : dd

        if (debouncedQuery || selectedStatuses.length) {
            filtered =
                data.filter(({full_name, status}) => {
                    if (debouncedQuery !== '' && !full_name.toLowerCase().includes(debouncedQuery.trim().toLowerCase())) {
                        return false;
                    }

                    // @ts-ignore
                    if (selectedStatuses.length && !selectedStatuses.some(s => s === status)) {
                        return false;
                    }
                    return true;
                }).slice(from, to);
        }

        setRecords(filtered);
    }, [sortStatus, data, page, pageSize, debouncedQuery, selectedStatuses]);

    return (
        <>
            <DataTable
                minHeight={200}
                verticalSpacing="xs"
                striped
                highlightOnHover
                columns={[
                    {
                        accessor: '',
                        title: 'Customer',
                        render: (item) => {
                            const {full_name, email} = item,
                                firstName = full_name.split(' ')[0],
                                lastName = full_name.split(' ')[1]

                            return (
                                <Flex gap="xs" align="center">
                                    <Avatar
                                        src={null}
                                        alt={`${firstName} ${lastName}`}
                                        variant="filled"
                                        radius="xl"
                                        color={theme.colors[theme.primaryColor][7]}
                                    >
                                        {Array.from(firstName)[0]}{Array.from(lastName)[0]}
                                    </Avatar>
                                    <Stack spacing={1}>
                                        <Text fw={600}>{full_name}</Text>
                                        <Text fz="sm">{email}</Text>
                                    </Stack>
                                </Flex>)
                        },
                        sortable: true,
                        filter: (
                            <TextInput
                                label="Customer"
                                description="Show customer whose names include the specified text"
                                placeholder="Search customer..."
                                icon={<IconSearch size={16}/>}
                                value={query}
                                onChange={(e) => setQuery(e.currentTarget.value)}
                            />
                        ),
                        filtering: query !== '',
                    },
                    {
                        accessor: 'status',
                        render: (item) => <StatusBadge status={item.status}/>,
                        filter: (
                            <MultiSelect
                                label="Status"
                                description="Show all products with status"
                                data={statuses}
                                value={selectedStatuses}
                                placeholder="Search statuses…"
                                onChange={setSelectedStatuses}
                                icon={<IconSearch size={16}/>}
                                clearable
                                searchable
                            />
                        ),
                        filtering: selectedStatuses.length > 0,
                    },
                    {
                        accessor: 'id',
                        render: (item) => <Text>#{item.id.slice(0, 7)}</Text>
                    },
                    {
                        accessor: 'amount',
                        sortable: true,
                        render: (item) => <Text>${item.amount}</Text>
                    },
                    {
                        accessor: 'issue_date'
                    },
                    {
                        accessor: '',
                        title: 'Actions',
                        render: (item) =>
                            <Group spacing="sm">
                                <Tooltip label="Download invoice">
                                    <ActionIcon>
                                        <IconCloudDownload size={ICON_SIZE}/>
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="View invoice details">
                                    <ActionIcon
                                        onClick={() => router.push(PATH_INVOICES.invoices.invoice_details(item.id))}
                                    >
                                        <IconEye size={ICON_SIZE}/>
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                    }
                ]}
                records={records}
                selectedRecords={selectedRecords}
                onSelectedRecordsChange={setSelectedRecords}
                totalRecords={(debouncedQuery || selectedStatuses.length > 0) ? records.length : data.length}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={(p) => setPage(p)}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
            />
        </>
    );
};

export default InvoicesTable;
