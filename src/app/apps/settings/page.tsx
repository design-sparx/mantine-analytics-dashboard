import { Settings } from './Settings';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function Page() {
  return <Settings />;
}
