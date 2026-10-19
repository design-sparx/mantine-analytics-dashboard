import { Blank } from './Blank';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blank page',
};

export default function Page() {
  return <Blank />;
}
