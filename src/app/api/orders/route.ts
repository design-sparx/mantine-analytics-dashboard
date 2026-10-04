import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('Orders.json', 'Orders');
}
