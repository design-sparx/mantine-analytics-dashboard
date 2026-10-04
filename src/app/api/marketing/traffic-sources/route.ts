import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('traffic-sources.json', 'Traffic sources');
}
