import { LogisticsDashboard } from './LogisticsDashboard';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Logistics Dashboard',
  description:
    'Logistics dashboard for shipment tracking, fleet management, delivery performance monitoring, and route optimization. Manage warehouse inventory and analyze logistics operations.',
};

export default function Page() {
  return <LogisticsDashboard />;
}
