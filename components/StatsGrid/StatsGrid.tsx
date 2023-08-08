import {Badge, Group, Paper, PaperProps, SimpleGrid, Text} from '@mantine/core';
import {IconArrowDownRight, IconArrowUpRight,} from '@tabler/icons-react';
import useStyles from "./StatsGrid.styles";
import StatsCard from "@/components/StatsCard/StatsCard";

type StatsGridProps = {
    data?: { title: string; value: string; diff: number, period?: string }[];
    paperProps: PaperProps
}

export default function StatsGrid({data, paperProps}: StatsGridProps) {
    const {classes} = useStyles();
    const stats = data?.map((stat) => <StatsCard key={stat.title} data={stat} {...paperProps}/>);

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
