import { Badge, Group, PaperProps, Text } from '@mantine/core';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';

import { Surface } from '@/components';

import classes from './StatsCard.module.css';

type StatsCardProps = {
  data: { title: string; value: string; diff: number; period?: string };
} & PaperProps;

const StatsCard = ({ data, ...others }: StatsCardProps) => {
  const { title, value, period, diff } = data;
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight;

  return (
    <Surface {...others}>
      <Group justify="space-between">
        <Text size="xs" className={classes.title}>
          {title}
        </Text>
        {period && (
          <Badge variant="filled" radius="sm">
            {period}
          </Badge>
        )}
      </Group>

      <Group align="flex-end" gap="xs" mt={25}>
        <Text className={classes.value}>{value}</Text>
        <Text
          c={diff > 0 ? 'teal' : 'red'}
          fz="sm"
          fw={500}
          className={classes.diff}
        >
          <span>{diff}%</span>
          <DiffIcon size="1rem" stroke={1.5} />
        </Text>
      </Group>

      <Text fz="xs" mt={7}>
        Compared to previous month
      </Text>
    </Surface>
  );
};

export default StatsCard;
