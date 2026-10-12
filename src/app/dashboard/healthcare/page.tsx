import { HealthcareDashboard } from './HealthcareDashboard';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healthcare Dashboard',
  description:
    'Healthcare dashboard for patient management, appointment tracking, bed occupancy monitoring, and medical inventory management. Track hospital operations and patient satisfaction.',
};

export default function Page() {
  return <HealthcareDashboard />;
}
