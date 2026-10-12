import { Invoices } from './Invoices';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices',
  description: 'Manage invoices in your dashboard',
};

export default function Page() {
  return <Invoices />;
}
