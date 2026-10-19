'use client';

import dynamic from 'next/dynamic';

const RevenueChart = dynamic(
  () =>
    import('@/components/revenue-chart/RevenueChart').then(
      (mod) => mod.default,
    ),
  {
    ssr: false,
    loading: () => <div style={{ height: '400px' }} />,
  },
);

export default RevenueChart;
