import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('Sales.json', 'Sales data');
}
