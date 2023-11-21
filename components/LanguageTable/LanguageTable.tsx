import {ActionIcon, Group, Paper, PaperProps, Text} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import {IconDotsVertical} from "@tabler/icons-react";
import {Surface} from "@/components";

type LanguageTableProps = {
    data?: { id: string, language: string, users: number, users_percentage: number }[]
} & PaperProps

const LanguageTable = ({data, ...others}: LanguageTableProps) => {
    return (
        <Surface component={Paper} {...others}>
            <Group justify="space-between" mb="sm">
                <Text size="lg" fw={600}>Languages</Text>
                <ActionIcon variant="subtle">
                    <IconDotsVertical size={16}/>
                </ActionIcon>
            </Group>
            <DataTable
                verticalSpacing="sm"
                highlightOnHover
                columns={[
                    {accessor: 'language'},
                    {accessor: 'users'},
                    {accessor: 'users_percentage', title: 'Users %'}
                ]}
                records={data}
            />
        </Surface>
    );
};

export default LanguageTable
