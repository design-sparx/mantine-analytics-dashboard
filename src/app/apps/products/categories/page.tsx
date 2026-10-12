import { ProductCategories } from './ProductCategories';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Categories',
  description: 'Manage product categories in your dashboard',
};

export default function Page() {
  return <ProductCategories />;
}
