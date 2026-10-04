import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('active-shipments.json', 'Active shipments');
}
