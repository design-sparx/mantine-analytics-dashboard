import {useState} from "react";
import {Id, KanbanTask as ITask} from "../../types";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {IconMessageCircle, IconTrash} from "@tabler/icons-react";
import {
    ActionIcon,
    Avatar,
    Box,
    Button,
    Flex,
    Paper,
    rem,
    Stack,
    Text,
    Textarea,
    Tooltip,
    useMantineTheme
} from "@mantine/core";
import {useHover} from "@mantine/hooks";
import useStyles from "./KanbanCard.styles"

const AVATARS = [
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
];

type Props = {
    task: ITask;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}

const KanbanCard = (props: Props) => {
    const {classes} = useStyles()
    const {task, deleteTask, updateTask} = props;
    const theme = useMantineTheme()
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        disabled: editMode,
    });
    const {hovered} = useHover();
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false);
    };

    if (isDragging) {
        return (
            <Box
                ref={setNodeRef}
                style={style}
                sx={{
                    backgroundColor: theme.colors.dark[0],
                    opacity: .3,
                    minHeight: '100px',
                    display: 'flex',
                    textAlign: 'left',
                    cursor: 'grab',
                    position: 'relative',
                    alignItems: 'center'
                }}
                p="sm"
            />
        );
    }

    if (editMode) {
        return (
            <Box
                component="div"
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                sx={{
                    minHeight: '100px',
                    display: 'flex',
                    textAlign: 'left',
                    cursor: 'grab',
                    position: 'relative',
                    alignItems: 'center',
                    border: `2px solid ${theme.colors.blue[5]}`,
                    borderRadius: theme.radius.sm
                }}
                p="sm"
            >
                <Textarea
                    sx={{
                        height: '90%',
                        border: 'none',
                        outline: 'none',
                        width: rem(296),
                    }}
                    value={task.content}
                    autoFocus
                    placeholder="Task content here"
                    onBlur={toggleEditMode}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.shiftKey) {
                            toggleEditMode();
                        }
                    }}
                    onChange={(e) => updateTask(task.id, e.target.value)}
                />
            </Box>
        );
    }

    return (
        <Paper
            ref={setNodeRef}
            style={style}
            p="sm"
            withBorder
            sx={{
                minHeight: '100px',
                textAlign: 'left',
                cursor: 'grab',
                position: 'relative',
            }}
            onClick={toggleEditMode}
            className={classes.card}
            onMouseEnter={() => {
                setMouseIsOver(true);
            }}
            onMouseLeave={() => {
                setMouseIsOver(false);
            }}
            {...attributes}
            {...listeners}
        >
            <Stack>
                <Flex>
                    <Text
                        my="auto"
                        size="sm"
                        style={{height: '90%', width: '100%', overflowY: 'hidden', overflowX: 'hidden'}}
                    >
                        {task.content}
                    </Text>

                    {mouseIsOver && (
                        <Tooltip label="Delete card">
                            <ActionIcon
                                sx={{
                                    position: 'absolute',
                                    right: rem(7),
                                    bottom: rem(7)
                                }}
                                onClick={() => {
                                    deleteTask(task.id);
                                }}
                            >
                                <IconTrash size={18}/>
                            </ActionIcon>
                        </Tooltip>
                    )}
                </Flex>
                <Flex gap="md" align="center">
                    <Avatar.Group spacing="sm">
                        <Avatar src={AVATARS[0]} size="md" radius="xl"/>
                        <Avatar src={AVATARS[1]} size="md" radius="xl"/>
                        <Avatar src={AVATARS[2]} size="md" radius="xl"/>
                        <Avatar size="md" radius="xl">+5</Avatar>
                    </Avatar.Group>
                    {task?.comments !== undefined &&
                        <Button rightIcon={<IconMessageCircle size={18}/>} size="sm" variant="white" radius="md">
                            {task.comments}
                        </Button>
                    }
                </Flex>
            </Stack>
        </Paper>
    );
}

export default KanbanCard;
