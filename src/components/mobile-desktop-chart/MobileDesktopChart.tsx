'use client';

import {
  ActionIcon,
  Group,
  PaperProps,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { BarChart } from '@mantine/charts';
import { IconDotsVertical } from '@tabler/icons-react';

import { Surface } from '@/components';

type MobileDesktopChartProps = PaperProps;
const MobileDesktopChart = ({ ...others }: MobileDesktopChartProps) => {
  const theme = useMantineTheme();

  const data = [
    {
      month: 'Jan',
      'Product A': 44,
      'Product B': 13,
    },
    {
      month: 'Feb',
      'Product A': 55,
      'Product B': 23,
    },
    {
      month: 'Mar',
      'Product A': 41,
      'Product B': 20,
    },
    {
      month: 'Apr',
      'Product A': 67,
      'Product B': 8,
    },
    {
      month: 'May',
      'Product A': 22,
      'Product B': 13,
    },
    {
      month: 'Jun',
      'Product A': 43,
      'Product B': 27,
    },
    {
      month: 'Jul',
      'Product A': 34,
      'Product B': 10,
    },
  ];

  return (
    <Surface {...others}>
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>
          Mobile/Desktop
        </Text>
        <ActionIcon variant="subtle">
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Group>
      <BarChart
        h={300}
        data={data}
        dataKey="month"
        type="stacked"
        series={[
          { name: 'Product A', color: theme.colors[theme.primaryColor][8] },
          { name: 'Product B', color: theme.colors[theme.primaryColor][2] },
        ]}
        withLegend
        legendProps={{ verticalAlign: 'bottom', height: 50 }}
      />
    </Surface>
  );
};

export default MobileDesktopChart;
