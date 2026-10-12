import { ClientChangelog } from './ClientChangelog';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Release history and version changes for the dashboard.',
};

export default function Page() {
  return <ClientChangelog />;
}
