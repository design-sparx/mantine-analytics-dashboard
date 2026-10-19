import { HrDashboard } from './HrDashboard';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HR Dashboard',
  description:
    'HR dashboard for employee management, recruitment tracking, performance monitoring, and attendance analytics. Manage workforce and analyze HR operations.',
};

export default function Page() {
  return <HrDashboard />;
}
