import {Paper, Text} from "@mantine/core";
import {DataTable} from "mantine-datatable";

type LanguageTableProps = {
    data?: { id: string, language: string, users: number, users_percentage: number }[]
}

const LanguageTable = ({data}: LanguageTableProps) => {
    return (
        <Paper>
            <Text>Languages</Text>
            <DataTable
                columns={[
                    {accessor: 'language'},
                    {accessor: 'users'},
                    {accessor: 'users_percentage', title: 'Users %'}
                ]}
                records={data}
            />
        </Paper>
    );
};

export default LanguageTable
