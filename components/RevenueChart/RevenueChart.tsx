import {ActionIcon, Group, Paper, PaperProps, Text, useMantineTheme} from "@mantine/core";
import dynamic from 'next/dynamic';
import {IconDotsVertical} from "@tabler/icons-react";

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

type RevenueChartProps = PaperProps

const RevenueChart = ({...others}: RevenueChartProps) => {
    const theme = useMantineTheme()

    const series = [{
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100]
    }, {
        name: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41]
    }]

    const options = {
        chart: {
            height: 350,
            type: 'area',
            fontFamily: 'Manrope, sans-serif'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
            labels: {
                style: {
                    colors: theme.colorScheme === "dark" ? theme.white : theme.black
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: theme.colorScheme === "dark" ? theme.white : theme.black
                }
            }
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        },
        colors: [theme.colors[theme.primaryColor][5], theme.colors[theme.primaryColor][2]]
    }

    return (
        <Paper {...others}>
            <Group position="apart" mb="md">
                <Text size="lg" fw={600}>Total revenue</Text>
                <ActionIcon>
                    <IconDotsVertical size={18}/>
                </ActionIcon>
            </Group>
            {/*@ts-ignore*/}
            <Chart options={options} series={series} type="area" height={350}/>
        </Paper>
    );
};

export default RevenueChart
