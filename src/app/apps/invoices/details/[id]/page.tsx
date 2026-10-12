import { mockStore } from '@/lib/api/mock-store';

import { InvoiceDetails } from './InvoiceDetails';

import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

/** Reads the invoice number so the title names the document, not a raw id. */
async function fetchInvoiceNumber(id: string): Promise<string | undefined> {
  try {
    const invoice = await mockStore.getById<Record<string, string>>(
      'Invoices.json',
      id,
    );
    return invoice?.invoiceNumber ?? invoice?.number;
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
 * available to it. The mock store is read here directly, since the number is
 * what identifies the document. Falls back to the route id.
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
