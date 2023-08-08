import {ActionIcon, Group, Paper, PaperProps, Text} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import {IconDotsVertical} from "@tabler/icons-react";
import dayjs from "dayjs";

type LanguageTableProps = {
    data?: { id: string, source: string, sessions: number, bounce_rate: number, avg_session_period: number }[]
} & PaperProps

const TrafficTable = ({data, ...others}: LanguageTableProps) => {
    return (
        <Paper {...others}>
            <Group position="apart" mb="sm">
                <Text size="lg" fw={600}>Network Traffic</Text>
                <ActionIcon>
                    <IconDotsVertical size={18}/>
                </ActionIcon>
            </Group>
            <DataTable
                verticalSpacing='sm'
                highlightOnHover
                columns={[
                    {accessor: 'source'},
                    {accessor: 'users'},
                    {accessor: 'sessions'},
                    {accessor: 'bounce_rate', render: ({bounce_rate}) => <Text>{bounce_rate}%</Text>},
                    {
                        accessor: 'avg_session_period',
                        render: ({avg_session_period}) => {
                            const seconds = avg_session_period;

                            // ✅ get hh:mm:ss string
                            const result = new Date(seconds * 1000)
                                .toISOString()
                                .slice(11, 19);
                            console.log(result); // 👉️ "00:10:00" (hh:mm:ss)
                            const hh = result.split(':')[0], mm = result.split(':')[1], ss = result.split(":")[3]

                            return <Text>{hh}h {mm}m {ss}s</Text>
                        }
                    }
                ]}
                records={data}
            />
        </Paper>
    );
};

export default TrafficTable
