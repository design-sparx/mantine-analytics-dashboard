import dynamic from "next/dynamic";
import {ActionIcon, Group, Paper, PaperProps, Text, useMantineTheme} from "@mantine/core";
import {IconDotsVertical} from "@tabler/icons-react";

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

type MobileDesktopChartProps = PaperProps
const MobileDesktopChart = ({...others}: MobileDesktopChartProps) => {
    const theme = useMantineTheme()
    const series = [{
        name: 'PRODUCT A',
        data: [44, 55, 41, 67, 22, 43, 34]
    }, {
        name: 'PRODUCT B',
        data: [13, 23, 20, 8, 13, 27, 10]
    }]

    const options = {
        chart: {
            type: 'bar',
            height: 300,
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            },
            fontFamily: 'Manrope, sans-serif'
        },
        dataLabels: {
            enabled: false
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
                            fontWeight: 900
                        }
                    },
                },
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
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
        colors: [theme.colors[theme.primaryColor][8], theme.colors[theme.primaryColor][2]],
        legend: {
            labels: {
                colors: [theme.colorScheme === "dark" ? theme.white : theme.black]
            }
        }
    }

    return (
        <Paper {...others}>
            <Group position="apart" mb="md">
                <Text size="lg" fw={600}>Mobile/Desktop</Text>
                <ActionIcon>
                    <IconDotsVertical size={18}/>
                </ActionIcon>
            </Group>
            {/*@ts-ignore*/}
            <Chart options={options} series={series} type="bar" height={300}/>
        </Paper>
    );
};

export default MobileDesktopChart
