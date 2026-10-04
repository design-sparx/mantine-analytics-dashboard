import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('sales-trends.json', 'Sales trends');
}
