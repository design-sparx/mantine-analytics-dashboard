import { ReactNode } from 'react';

import { ActionIcon, Group, PaperProps, Text } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';

import { ErrorAlert, Surface } from '@/components';

type LanguageTableProps = {
  data?: {
    id: string;
    source: string;
    sessions: number;
    bounce_rate: number;
    avg_session_period: number;
  }[];
  loading: boolean;
  error: ReactNode | Error | null | undefined;
} & PaperProps;

const TrafficTable = ({
  data,
  error,
  loading,
  ...others
}: LanguageTableProps) => {
  return (
    <Surface {...others}>
      <Group justify="space-between" mb="sm">
        <Text size="lg" fw={600}>
          Network Traffic
        </Text>
        <ActionIcon variant="subtle">
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Group>
      {error ? (
        <ErrorAlert
          title="Error loading languages"
          message={error.toString()}
        />
      ) : (
        <DataTable
          verticalSpacing="sm"
          highlightOnHover
          columns={[
            { accessor: 'source' },
            { accessor: 'visitors' },
            { accessor: 'pageviews' },
            {
              accessor: 'bounce_rate',
              render: ({ bounce_rate }) => <Text fz="sm">{bounce_rate}%</Text>,
            },
            {
              accessor: 'avg_session_duration',
              title: 'Avg session (sec)',
              render: ({ avg_session_period }) => (
                <Text fz="sm">{avg_session_period}s</Text>
              ),
            },
          ]}
          records={data}
          fetching={loading}
        />
      )}
    </Surface>
  );
};

export default TrafficTable;
