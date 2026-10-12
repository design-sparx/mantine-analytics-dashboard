import { SITE_DESCRIPTION } from '@/constants/site';

import { SaasDashboard } from './SaasDashboard';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SaaS Dashboard',
  description: SITE_DESCRIPTION,
};

export default function Page() {
  return <SaasDashboard />;
}
