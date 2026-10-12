import { MarketingDashboard } from './MarketingDashboard';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketing Dashboard',
  description:
    'Marketing dashboard for campaign tracking, social media analytics, email marketing performance, and ROI analysis. Monitor marketing metrics and optimize campaigns.',
};

export default function Page() {
  return <MarketingDashboard />;
}
