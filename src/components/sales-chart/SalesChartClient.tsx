'use client';

import dynamic from 'next/dynamic';

const SalesChart = dynamic(
  () =>
    import('@/components/sales-chart/SalesChart').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div style={{ height: '400px' }} />,
  },
);

export default SalesChart;
