import { Products } from './Products';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products',
};

export default function Page() {
  return <Products />;
}
