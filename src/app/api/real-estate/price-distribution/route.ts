import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('price-distribution.json', 'Price distribution');
}
