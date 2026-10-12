import { EducationDashboard } from './EducationDashboard';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Education Dashboard',
  description:
    'Education dashboard for student enrollment tracking, course completion monitoring, grade analysis, and instructor performance. Manage your learning management system effectively.',
};

export default function Page() {
  return <EducationDashboard />;
}
