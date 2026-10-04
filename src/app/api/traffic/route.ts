import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('Traffic.json', 'Traffic data');
}
