import { CrmDashboard } from './CrmDashboard';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CRM Dashboard',
  description:
    'CRM dashboard for customer relationship management, sales pipeline tracking, lead management, and deal monitoring. Track customer lifetime value and acquisition costs.',
};

export default function Page() {
  return <CrmDashboard />;
}
