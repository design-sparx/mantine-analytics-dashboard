import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('delivery-performance.json', 'Delivery performance');
}
