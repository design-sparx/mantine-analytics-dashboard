'use client';

import {
  ActionIcon,
  Group,
  PaperProps,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { AreaChart } from '@mantine/charts';
import { IconDotsVertical } from '@tabler/icons-react';

import { Surface } from '@/components';

type RevenueChartProps = PaperProps;

const RevenueChart = ({ ...others }: RevenueChartProps) => {
  const theme = useMantineTheme();

  const data = [
    {
      date: '00:00',
      series1: 31,
      series2: 11,
    },
    {
      date: '01:30',
      series1: 40,
      series2: 32,
    },
    {
      date: '02:30',
      series1: 28,
      series2: 45,
    },
    {
      date: '03:30',
      series1: 51,
      series2: 32,
    },
    {
      date: '04:30',
      series1: 42,
      series2: 34,
    },
    {
      date: '05:30',
      series1: 109,
      series2: 52,
    },
    {
      date: '06:30',
      series1: 100,
      series2: 41,
    },
  ];

  return (
    <Surface {...others}>
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>
          Total revenue
        </Text>
        <ActionIcon variant="subtle">
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Group>
      <AreaChart
        h={350}
        data={data}
        dataKey="date"
        series={[
          { name: 'series1', color: theme.colors[theme.primaryColor][5] },
          { name: 'series2', color: theme.colors[theme.primaryColor][2] },
        ]}
        curveType="natural"
        withLegend
        legendProps={{ verticalAlign: 'bottom', height: 50 }}
      />
    </Surface>
  );
};

export default RevenueChart;
