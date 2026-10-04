import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('top-products.json', 'Top products');
}
