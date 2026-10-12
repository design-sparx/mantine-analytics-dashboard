import { apiDetailPath } from '@/routes/api';

import { InvoiceDetails } from './InvoiceDetails';

import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

/** Reads the invoice number so the title names the document, not a raw id. */
async function fetchInvoiceNumber(id: string): Promise<string | undefined> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}${apiDetailPath(
        'invoices',
        id,
      )}`,
      { headers: { 'Content-Type': 'application/json' } },
    );
    if (!res.ok) return undefined;
    const body = await res.json();
    return body?.data?.invoiceNumber ?? body?.data?.number;
  } catch {
    // A failed read must not fail metadata resolution; the caller falls back
    // to the route id.
    return undefined;
  }
}

/**
 * Reads the invoice number for the title.
 *
 * The page body fetches the invoice on the client, so the number is not
 * available to it. The API is read here as well — it is a mock endpoint, and
 * the number is what identifies the document. Falls back to the route id.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const invoiceNumber = await fetchInvoiceNumber(id);

  return {
    title: invoiceNumber ? `Invoice - ${invoiceNumber}` : `Invoice - ${id}`,
    description: 'View detailed invoice information and manage invoice status.',
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <InvoiceDetails id={id} />;
}
