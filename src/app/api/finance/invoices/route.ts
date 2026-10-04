import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('invoices-finance.json', 'Finance invoices');
}
