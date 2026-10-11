'use client';

import dynamic from 'next/dynamic';

const TrafficTable = dynamic(
  () =>
    import('@/components/traffic-table/TrafficTable').then(
      (mod) => mod.default,
    ),
  {
    ssr: false,
    loading: () => <div style={{ height: '400px' }} />,
  },
);

export default TrafficTable;
