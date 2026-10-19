import { Customers } from './Customers';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
  description: 'Manage customers in your dashboard',
};

export default function Page() {
  return <Customers />;
}
