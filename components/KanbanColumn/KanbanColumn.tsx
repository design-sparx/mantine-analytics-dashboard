import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {Id, KanbanColumn as IColumn, KanbanTask as ITask} from "../../types";
import {CSS} from "@dnd-kit/utilities";
import {useMemo, useState} from "react";
import {IconCirclePlus, IconTrash} from "@tabler/icons-react";
import {KanbanCard} from "@/components";
import {
    ActionIcon,
    Badge,
    Box,
    Flex,
    Paper,
    rem,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    Tooltip,
    UnstyledButton,
    useMantineTheme
} from "@mantine/core";

const ICON_SIZE = 18

type Props = {
    column: IColumn;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;

    createTask: (columnId: Id) => void;
    updateTask: (id: Id, content: string) => void;
    deleteTask: (id: Id) => void;
    tasks: ITask[];
}

const KanbanColumn = (props: Props) => {
    const theme = useMantineTheme()
    const {
        column,
        deleteColumn,
        updateColumn,
        createTask,
        tasks,
        deleteTask,
        updateTask
    } = props;
    const [editMode, setEditMode] = useState(false);

    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <Paper
                withBorder
                ref={setNodeRef}
                style={style}
                sx={{
                    width: '350px',
                    height: '500px',
                    maxHeight: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    border: `3px solid ${theme.colors.pink[5]}`
                }}
            ></Paper>
        );
    }

    return (
        <Box
            ref={setNodeRef}
            style={style}
            p={4}
            sx={{
                width: '350px',
                height: rem(600),
                maxHeight: rem(600),
                display: 'flex',
                flexDirection: 'column',
                background: theme.colors.gray[1]
            }}
        >
            {/* Column title */}
            <Flex
                onClick={() => {
                    setEditMode(true);
                }}
                p="xs"
                align="center"
                justify="space-between"
                sx={{
                    cursor: 'grab',
                }}
                {...attributes}
                {...listeners}
            >
                <Flex gap="sm" align="center">
                    <Badge
                        variant="filled"
                        px="sm"
                        py="xs"
                        radius="sm"
                    >
                        {tasks.length}
                    </Badge>
                    {!editMode && <Text>{column.title}</Text>}
                    {editMode && (
                        <TextInput
                            className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                            value={column.title}
                            onChange={(e) => updateColumn(column.id, e.target.value)}
                            autoFocus
                            onBlur={() => {
                                setEditMode(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                setEditMode(false);
                            }}
                        />
                    )}
                </Flex>
                <Tooltip label="Delete column">
                    <ActionIcon
                        onClick={() => {
                            deleteColumn(column.id);
                        }}
                    >
                        <IconTrash size={ICON_SIZE}/>
                    </ActionIcon>
                </Tooltip>
            </Flex>

            {/* Column task container */}
            <ScrollArea
                h={500}
                sx={{flexGrow: 1, overflowX: 'hidden', overflowY: 'auto'}}>
                <Stack spacing="sm" px="sm">
                    <SortableContext items={tasksIds}>
                        {tasks.map((task) => (
                            <KanbanCard
                                key={task.id}
                                task={task}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                            />
                        ))}
                    </SortableContext>
                </Stack>
            </ScrollArea>
            {/* Column footer */}
            <UnstyledButton
                p="xs"
                sx={{
                    display: 'flex',
                    gap: rem(7),
                    alignItems: 'center',
                    border: `1px solid ${theme.colors.blue[5]}`,
                    justifyContent: 'flex-start',
                    backgroundColor: theme.colors.blue[6],
                    color: theme.white,
                    borderRadius: theme.radius.sm,
                    fontWeight: 500
                }}
                onClick={() => {
                    createTask(column.id);
                }}
            >
                <IconCirclePlus size={ICON_SIZE}/>
                Add task
            </UnstyledButton>
        </Box>
    );
}

export default KanbanColumn;
