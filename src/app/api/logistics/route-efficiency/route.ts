import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('route-efficiency.json', 'Route efficiency');
}
