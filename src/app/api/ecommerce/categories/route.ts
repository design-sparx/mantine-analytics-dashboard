import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('revenue-by-category.json', 'Revenue by category');
}
