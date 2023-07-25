import {Badge, Group, Paper, SimpleGrid, Text} from '@mantine/core';
import {IconArrowDownRight, IconArrowUpRight,} from '@tabler/icons-react';
import useStyles from "./StatsGrid.styles";
import StatsCard from "@/components/StatsCard/StatsCard";

interface StatsGridProps {
    data?: { title: string; value: string; diff: number, period?: string }[];
}

export default function StatsGrid({data}: StatsGridProps) {
    const {classes} = useStyles();
    const stats = data?.map((stat) => <StatsCard key={stat.title} data={stat}/>);
    return (
        <div className={classes.root}>
            <SimpleGrid
                cols={4}
                breakpoints={[
                    {maxWidth: 'md', cols: 2},
                    {maxWidth: 'xs', cols: 1},
                ]}
            >
                {stats}
            </SimpleGrid>
        </div>
    );
}
