import { EcommerceDashboard } from './EcommerceDashboard';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'E-commerce Dashboard',
  description:
    'E-commerce dashboard for online store metrics, sales analytics, inventory management, and order tracking. Monitor revenue, conversion rates, and product performance.',
};

export default function Page() {
  return <EcommerceDashboard />;
}
