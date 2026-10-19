import { Email } from './Email';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email',
  description: 'Manage your emails',
};

export default function Page() {
  return <Email />;
}
