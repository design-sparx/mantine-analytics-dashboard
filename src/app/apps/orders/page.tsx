import { Orders } from './Orders';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Manage orders in your dashboard',
};

export default function Page() {
  return <Orders />;
}
