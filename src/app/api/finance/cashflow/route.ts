import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('cashflow.json', 'Cashflow data');
}
