import dynamic from "next/dynamic";
import {Paper, PaperProps, Text} from "@mantine/core";

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

type MobileDesktopChartProps = PaperProps
const MobileDesktopChart = ({...others}: MobileDesktopChartProps) => {
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
                    }
                }
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        }
    }

    return (
        <Paper {...others}>
            <Text>Mobile/Desktop</Text>
            {/*@ts-ignore*/}
            <Chart options={options} series={series} type="bar" height={300}/>
        </Paper>
    );
};

export default MobileDesktopChart
