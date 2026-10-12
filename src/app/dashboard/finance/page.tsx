import { FinanceDashboard } from './FinanceDashboard';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finance Dashboard',
  description:
    'Finance dashboard for financial management, cashflow tracking, expense analysis, and invoice monitoring. Track profit margins, revenue, and expenses.',
};

export default function Page() {
  return <FinanceDashboard />;
}
