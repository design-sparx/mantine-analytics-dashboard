// KanbanCard.tsx
import {Paper, Stack, Text, useMantineTheme} from "@mantine/core";
import {useDraggable} from "@dnd-kit/core";
import {KanbanTask} from "@/components/KanbanBoard/KanbanBoard";

const avatars = [
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
];

type KanbanCardProps = {
    item: KanbanTask;
    index: number;
    parent: string;
}

const KanbanCard = ({item, index, parent,}: KanbanCardProps) => {
    const theme = useMantineTheme()
    const {title} = item

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: `card-${title}-${item.id}`,
        data: {
            title,
            index,
            parent,
        },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <Paper
            ref={setNodeRef}
            withBorder
            sx={{
                cursor: "grab"
            }}
            style={style}
            {...listeners}
            {...attributes}
        >
            <Stack>
                <Text lineClamp={2}>{item.title}</Text>
            </Stack>
        </Paper>
    );
};

export default KanbanCard
