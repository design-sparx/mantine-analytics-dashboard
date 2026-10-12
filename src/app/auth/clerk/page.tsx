import { Clerk } from './Clerk';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clerk',
};

export default function Page() {
  return <Clerk />;
}
