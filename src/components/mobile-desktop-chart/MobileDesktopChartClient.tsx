'use client';

import dynamic from 'next/dynamic';

const MobileDesktopChart = dynamic(
  () =>
    import('@/components/mobile-desktop-chart/MobileDesktopChart').then(
      (mod) => mod.default,
    ),
  {
    ssr: false,
    loading: () => <div style={{ height: '400px' }} />,
  },
);

export default MobileDesktopChart;
