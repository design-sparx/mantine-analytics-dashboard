import { SITE_DESCRIPTION, SITE_NAME } from '@/constants/site';

import { Home } from './Home';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  // An absolute title: the root layout's `title.template` does not apply to a
  // page in the same route segment.
  title: `${SITE_NAME} | Website UI Kit`,
  description: SITE_DESCRIPTION,
};

export default function Page() {
  return <Home />;
}
