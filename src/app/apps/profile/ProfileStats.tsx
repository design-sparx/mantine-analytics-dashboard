'use client';

import { PaperProps, SimpleGrid, SimpleGridProps } from '@mantine/core';
import {
  IconBusinessplan,
  IconCoins,
  IconListCheck,
} from '@tabler/icons-react';

import { ProfileStatsCard } from '@/components';

const GRID_PROPS: SimpleGridProps = {
  cols: { base: 1, md: 1, lg: 3 },
  spacing: { base: 10, sm: 'xl' },
  verticalSpacing: { base: 'md', sm: 'xl' },
};

/**
 * Icon components are created here, on the client, because a Server Component
 * cannot pass functions such as `icon={IconCoins}` into a Client Component.
 */
export function ProfileStats({ paperProps }: { paperProps: PaperProps }) {
  return (
    <SimpleGrid {...GRID_PROPS}>
      <ProfileStatsCard
        amount={81314}
        title="total earnings"
        icon={IconCoins}
        progressValue={45}
        color="indigo.7"
        asCurrency
        {...paperProps}
      />
      <ProfileStatsCard
        amount={2532}
        title="today's orders"
        icon={IconListCheck}
        progressValue={72}
        color="teal.7"
        {...paperProps}
      />
      <ProfileStatsCard
        amount={97219}
        title="total revenue"
        icon={IconBusinessplan}
        progressValue={12}
        color="lime.7"
        asCurrency
        {...paperProps}
      />
    </SimpleGrid>
  );
}
