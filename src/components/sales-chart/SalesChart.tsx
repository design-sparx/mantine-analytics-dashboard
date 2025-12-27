'use client';

import {
  ActionIcon,
  Group,
  PaperProps,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { DonutChart } from '@mantine/charts';
import { IconDotsVertical } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';

import { ErrorAlert, Surface } from '@/components';
import { useFetch } from '@mantine/hooks';
import { type IApiResponse } from '@/types/api-response';

type SalesChartProps = PaperProps;

const SalesChart = ({ ...others }: SalesChartProps) => {
  const theme = useMantineTheme();
  const {
    data: salesData,
    error: salesError,
    loading: salesLoading,
  } = useFetch<IApiResponse<any[]>>('/api/sales');

  const data = [
    { name: 'Category 1', value: 44, color: theme.colors[theme.primaryColor][9] },
    { name: 'Category 2', value: 55, color: theme.colors[theme.primaryColor][5] },
    { name: 'Category 3', value: 41, color: theme.colors[theme.primaryColor][3] },
    { name: 'Category 4', value: 17, color: theme.colors[theme.primaryColor][2] },
    { name: 'Category 5', value: 15, color: theme.colors[theme.primaryColor][1] },
  ];

  return (
    <Surface {...others}>
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>
          Weekly sales
        </Text>
        <ActionIcon variant="subtle">
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Group>
      <DonutChart
        data={data}
        thickness={30}
        size={160}
        chartLabel={`${data.reduce((acc, item) => acc + item.value, 0) / 1000}`}
      />
      {salesError ? (
        <ErrorAlert
          title="Error loading sales data"
          message={salesError.toString()}
        />
      ) : (
        <DataTable
          highlightOnHover
          columns={[
            { accessor: 'source' },
            { accessor: 'revenue' },
            { accessor: 'value' },
          ]}
          records={salesData?.data?.slice(0, 4) ?? []}
          height={200}
          fetching={salesLoading}
        />
      )}
    </Surface>
  );
};

export default SalesChart;
