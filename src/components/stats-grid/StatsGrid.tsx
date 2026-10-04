import { ReactNode } from 'react';

import { PaperProps, SimpleGrid, Skeleton } from '@mantine/core';

import { ErrorAlert, StatsCard } from '@/components';

import classes from './StatsGrid.module.css';

type StatsGridProps = {
  /**
   * Structural rather than a shared DTO: all twelve dashboards pass this shape,
   * so naming one domain's type here would couple unrelated pages together.
   */
  data?:
    | { title: string; value: string; diff: number; period?: string }[]
    | null;
  paperProps?: PaperProps;
  error: ReactNode | Error | undefined | null;
  loading?: boolean;
};

export default function StatsGrid({
  data,
  loading,
  error,
  paperProps,
}: StatsGridProps) {
  const stats = data?.map((stat) => (
    <StatsCard key={stat.title} data={stat} {...paperProps} />
  ));

  return (
    <div className={classes.root}>
      {error ? (
        <ErrorAlert title="Error loading stats" message={error.toString()} />
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {loading
            ? Array.from({ length: 4 }).map((o, i) => (
                <Skeleton
                  key={`stats-loading-${i}`}
                  visible={true}
                  height={200}
                />
              ))
            : stats}
        </SimpleGrid>
      )}
    </div>
  );
}
