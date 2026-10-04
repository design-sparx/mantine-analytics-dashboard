import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('real-estate-stats.json', 'Real estate stats');
}
