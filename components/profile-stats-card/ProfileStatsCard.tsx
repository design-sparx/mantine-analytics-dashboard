import { createElement } from 'react';

import {
  Flex,
  MantineColor,
  PaperProps,
  Progress,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import CountUp from 'react-countup';

import { Surface } from '@/components';

type ProfileStatsCardProps = {
  amount: number;
  title: string;
  icon: any;
  color: MantineColor;
  progressValue: number;
  asCurrency?: boolean;
} & PaperProps;

const ProfileStatsCard = (props: ProfileStatsCardProps) => {
  const { amount, color, title, icon, progressValue, asCurrency, ...others } =
    props;

  return (
    <Surface {...others}>
      <Flex align="center" justify="space-between" mb="md">
        <Stack gap={2}>
          <Text size="lg" fw={700} tt="capitalize">
            {asCurrency && '$ '}
            <CountUp end={amount} />
          </Text>
          <Text size="sm" c="dimmed" tt="capitalize">
            {title}
          </Text>
        </Stack>
        <ThemeIcon color={color} size="lg" radius="xl">
          {createElement(icon, { style: { fontSize: 16 } })}
        </ThemeIcon>
      </Flex>
      <Progress value={progressValue} color={color} size="sm" />
    </Surface>
  );
};

export default ProfileStatsCard;
