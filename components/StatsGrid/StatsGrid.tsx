import {PaperProps, SimpleGrid} from '@mantine/core';
import StatsCard from "@/components/StatsCard/StatsCard";
import classes from "./StatsGrid.module.css";

type StatsGridProps = {
  data?: { title: string; value: string; diff: number, period?: string }[];
  paperProps: PaperProps
}

export default function StatsGrid({data, paperProps}: StatsGridProps) {
  const stats = data?.map((stat) => <StatsCard key={stat.title} data={stat} {...paperProps}/>);

  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={{base: 1, sm: 2, lg: 4}}
        spacing={{base: 10, sm: 'xl'}}
        verticalSpacing={{base: 'md', sm: 'xl'}}
      >
        {stats}
      </SimpleGrid>
    </div>
  );
}
