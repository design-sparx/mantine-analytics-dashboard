import {DataTable} from "mantine-datatable";

type ProjectItem = {
    "id": string;
    "name": string;
    "start_date": string;
    "end_date": string;
    "state": string;
    "assignee": string;
}

type ProjectsTableProps = {
    data?: ProjectItem[]
}
const ProjectsTable = ({data}: ProjectsTableProps) => {
    return (
        <DataTable
            columns={[{accessor: 'name'}, {accessor: 'start_date'}, {accessor: 'end_date'}, {accessor: 'state'}, {accessor: 'assignee'}]}
            records={data}
        />
    );
};

export default ProjectsTable
