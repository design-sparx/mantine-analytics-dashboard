import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('order-status.json', 'Order status');
}
