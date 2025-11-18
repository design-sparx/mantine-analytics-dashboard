'use client';

import { ReactNode, useMemo } from 'react';

import { Alert, Center, Loader, Stack, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { DataTable, DataTableProps } from 'mantine-datatable';

import { BaseTableProps, TableError } from '@/types/table';

/**
 * BaseTable - A reusable table component with loading, error states, and empty state handling
 *
 * @component
 * @example
 * ```tsx
 * <BaseTable
 *   data={invoices}
 *   columns={columns}
 *   loading={isLoading}
 *   error={error}
 *   getRowId={(row) => row.id}
 * />
 * ```
 */
function BaseTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  error,
  onRetry,
  emptyState,
  onRowClick,
  getRowId,
  striped = true,
  highlightOnHover = true,
  withBorder = false,
  stickyHeader = false,
  maxHeight,
}: BaseTableProps<T>) {
  // Default empty state
  const defaultEmptyState = useMemo(
    () => ({
      title: 'No data available',
      description: 'There are no records to display.',
    }),
    []
  );

  const effectiveEmptyState = emptyState || defaultEmptyState;

  // Error rendering
  const renderError = (errorContent: TableError['error']) => {
    if (!errorContent) return null;

    let message: string;
    if (errorContent instanceof Error) {
      message = errorContent.message;
    } else if (typeof errorContent === 'string') {
      message = errorContent;
    } else {
      return errorContent as ReactNode;
    }

    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error loading data"
        color="red"
        variant="light"
      >
        <Stack gap="xs">
          <Text size="sm">{message}</Text>
          {onRetry && (
            <Text
              size="sm"
              c="blue"
              style={{ cursor: 'pointer' }}
              onClick={onRetry}
            >
              Click here to retry
            </Text>
          )}
        </Stack>
      </Alert>
    );
  };

  // Loading state
  if (loading && data.length === 0) {
    return (
      <Center p="xl">
        <Loader size="lg" />
      </Center>
    );
  }

  // Error state
  if (error) {
    return renderError(error);
  }

  // Empty state
  if (!loading && data.length === 0) {
    return (
      <Center p="xl">
        <Stack align="center" gap="md">
          {'icon' in effectiveEmptyState && effectiveEmptyState.icon}
          <Stack align="center" gap="xs">
            <Text size="lg" fw={600}>
              {effectiveEmptyState.title}
            </Text>
            {effectiveEmptyState.description && (
              <Text size="sm" c="dimmed">
                {effectiveEmptyState.description}
              </Text>
            )}
          </Stack>
          {'action' in effectiveEmptyState && effectiveEmptyState.action && (
            <button onClick={effectiveEmptyState.action.onClick}>
              {effectiveEmptyState.action.label}
            </button>
          )}
        </Stack>
      </Center>
    );
  }

  // Generate row key function
  const rowKey = getRowId
    ? (row: T) => String(getRowId(row, 0)) // DataTable idAccessor doesn't support index
    : undefined;

  // Handle row click
  const handleRowClick = onRowClick
    ? ({ record, index }: { record: T; index: number }) => onRowClick(record, index)
    : undefined;

  return (
    <DataTable<T>
      records={data}
      columns={columns}
      striped={striped}
      highlightOnHover={highlightOnHover}
      withTableBorder={withBorder}
      minHeight={maxHeight ? undefined : 200}
      height={maxHeight}
      fetching={loading}
      idAccessor={rowKey}
      onRowClick={handleRowClick}
    />
  );
}

export default BaseTable;
