'use client';

import dynamic from 'next/dynamic';

const MapChart = dynamic(
  () => import('@/components/map-chart/MapChart').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div style={{ height: '400px' }} />,
  },
);

export default MapChart;
