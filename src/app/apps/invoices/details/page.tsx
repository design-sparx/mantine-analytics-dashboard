import { SITE_DESCRIPTION } from '@/constants/site';

import { SampleInvoiceDetails } from './SampleInvoiceDetails';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sample Invoice Details',
  description: SITE_DESCRIPTION,
};

export default function Page() {
  return <SampleInvoiceDetails />;
}
