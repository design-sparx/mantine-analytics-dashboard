import type { InvoiceDto } from '@/types';

/**
 * Invoice status from API (enum as number)
 */
export type InvoiceStatusAPI = number;

/**
 * Invoice DTO from API
 */
export type InvoiceDTO = InvoiceDto;

/**
 * Invoice status display values
 */
export type InvoiceStatus =
  | 'sent'
  | 'suspended'
  | 'cancelled'
  | 'approved'
  | 'pending';

/**
 * Invoice table row data
 * This matches the structure of the mock data used in the table
 */
export type InvoiceTableRow = {
  id: string;
  full_name: string;
  email: string;
  status: InvoiceStatus;
  amount: number;
  issue_date: string;
};
