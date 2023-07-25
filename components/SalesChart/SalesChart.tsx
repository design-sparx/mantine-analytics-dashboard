import {Paper, Text} from "@mantine/core";
import dynamic from 'next/dynamic';
import {DataTable} from "mantine-datatable";
import SalesData from "../../mocks/Sales.json";

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

const SalesChart = () => {
    const series = [44, 55, 41, 17, 15];

    const options = {
        chart: { type: "donut" },
        legend: { show: false },
        dataLabels: { enabled: false },
        tooltip: { enabled: false },
        states: {
            hover: { filter: { type: "lighten", value: 0.5 } },
            active: { filter: { type: "none", value: 0 } }
        },
        stroke: { width: 0 },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: "75%",
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '12px',
                            fontWeight: '400',
                            color: '#6E7191'
                        },
                        value: {
                            show: true,
                            fontSize: '22px',
                            fontWeight: '600',
                            color: '#2E285C'
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            formatter: function (w: any) {
                                const totals = w.globals.seriesTotals;

                                const result = totals.reduce((a: number, b: number) => a + b, 0);

                                return (result / 1000).toFixed(3);
                            }
                        }
                    }
                }
            }
        }
    };

    return (
        <Paper>
            <Text>Weekly sales</Text>
            {/*@ts-ignore*/}
            <Chart options={options} series={series} type="donut" height={160}/>
            <DataTable
                columns={[{accessor: 'source'}, {accessor: 'revenue'}, {accessor: 'value'}]}
                records={SalesData.slice(0, 5)}
            />
        </Paper>
    );
};

export default SalesChart
