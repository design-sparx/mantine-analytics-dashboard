import { Pricing } from './Pricing';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
};

export default function Page() {
  return <Pricing />;
}
