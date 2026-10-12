import { RealEstateDashboard } from './RealEstateDashboard';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Real Estate Dashboard',
  description:
    'Real estate dashboard for property management, sales tracking, market analytics, and location performance. Monitor property listings and analyze real estate market trends.',
};

export default function Page() {
  return <RealEstateDashboard />;
}
