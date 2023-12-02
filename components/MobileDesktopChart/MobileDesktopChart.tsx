'use client';

import dynamic from 'next/dynamic';
import {
  ActionIcon,
  Group,
  Paper,
  PaperProps,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { Surface } from '@/components';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type MobileDesktopChartProps = PaperProps;
const MobileDesktopChart = ({ ...others }: MobileDesktopChartProps) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const series = [
    {
      name: 'PRODUCT A',
      data: [44, 55, 41, 67, 22, 43, 34],
    },
    {
      name: 'PRODUCT B',
      data: [13, 23, 20, 8, 13, 27, 10],
    },
  ];

  const options: any = {
    chart: {
      type: 'bar',
      height: 300,
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
      fontFamily: 'Open Sans, sans-serif',
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '25%',
        dataLabels: {
          total: {
            enabled: false,
            style: {
              fontSize: '13px',
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      labels: {
        style: {
          colors: colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },
    colors: [
      theme.colors[theme.primaryColor][8],
      theme.colors[theme.primaryColor][2],
    ],
    legend: {
      labels: {
        colors: [colorScheme === 'dark' ? theme.white : theme.black],
      },
    },
  };

  return (
    <Surface component={Paper} {...others}>
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>
          Mobile/Desktop
        </Text>
        <ActionIcon variant="subtle">
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Group>
      {/*@ts-ignore*/}
      <Chart
        options={options}
        series={series}
        type="bar"
        height={300}
        width={'100%'}
      />
    </Surface>
  );
};

export default MobileDesktopChart;
