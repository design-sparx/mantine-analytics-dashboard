import { Auth0 } from './Auth0';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auth0',
};

export default function Page() {
  return <Auth0 />;
}
