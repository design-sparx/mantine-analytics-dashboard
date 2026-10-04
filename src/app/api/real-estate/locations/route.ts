import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('location-analytics.json', 'Location analytics');
}
