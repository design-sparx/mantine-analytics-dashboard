import {Box, BoxProps, Paper, rem, Stack, Text, useMantineTheme} from "@mantine/core";
import {useDroppable} from "@dnd-kit/core";
import {KanbanCard} from "@/components";
import {KanbanTask} from "@/components/KanbanBoard/KanbanBoard";

type KanbanColumnProps = {
    title: string,
    items: KanbanTask[]
} & BoxProps

const KanbanColumn = ({title, items, ...others}: KanbanColumnProps) => {
    const theme = useMantineTheme()
    const {isOver, setNodeRef} = useDroppable({
        id: title,
    });

    const countItems = items?.length || 0;

    return (
        <Box
            sx={{
                height: countItems > 0 ? "auto" : rem(600),
                backgroundColor: isOver ? theme.colors.blue[4] : undefined,
            }}
            {...others}
        >
            <Text size="xl" mb="md">
                {title} {countItems}
            </Text>
            <Paper
                withBorder
                p="md"
                pb={rem(64)}
            >
                <Stack
                    ref={setNodeRef}
                >
                    {items.map((item, index) => (
                        <KanbanCard key={item.id} item={item} index={index} parent={title}/>
                    ))}
                </Stack>
            </Paper>
        </Box>
    )
}

export default KanbanColumn
