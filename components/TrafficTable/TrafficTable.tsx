import {Paper, Text} from "@mantine/core";
import {DataTable} from "mantine-datatable";

type LanguageTableProps = {
    data?: { id: string, source: string, sessions: number, bounce_rate: number, avg_session_period: number }[]
}

const TrafficTable = ({data}: LanguageTableProps) => {
    return (
        <Paper>
            <Text>Network traffic</Text>
            <DataTable
                columns={[
                    {accessor: 'source'},
                    {accessor: 'users'},
                    {accessor: 'sessions'},
                    {accessor: 'bounce_rate'},
                    {accessor: 'avg_session_period'}
                ]}
                records={data}
            />
        </Paper>
    );
};

export default TrafficTable
