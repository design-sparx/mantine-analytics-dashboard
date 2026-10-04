import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('ecommerce-stats.json', 'E-commerce stats');
}
