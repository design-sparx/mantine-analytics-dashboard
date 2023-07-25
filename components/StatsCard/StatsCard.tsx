import {Badge, Group, Paper, PaperProps, Text} from "@mantine/core";
import useStyles from "./Stats.styles";
import {IconArrowDownRight, IconArrowUpRight} from "@tabler/icons-react";

type StatsCardProps = { data: { title: string; value: string; diff: number, period?: string } } & PaperProps

const StatsCard = ({data, ...others}: StatsCardProps) => {
    const {title, value, period, diff} = data
    const {classes} = useStyles();
    const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
        <Paper withBorder p="sm" radius="sm" {...others}>
            <Group position="apart">
                <Text size="xs" color="dimmed" className={classes.title}>
                    {title}
                </Text>
                {period && <Badge>{period}</Badge>}
            </Group>

            <Group align="flex-end" spacing="xs" mt={25}>
                <Text className={classes.value}>{value}</Text>
                <Text color={diff > 0 ? 'teal' : 'red'} fz="sm" fw={500} className={classes.diff}>
                    <span>{diff}%</span>
                    <DiffIcon size="1rem" stroke={1.5}/>
                </Text>
            </Group>

            <Text fz="xs" c="dimmed" mt={7}>
                Compared to previous month
            </Text>
        </Paper>
    );
};

export default StatsCard;
