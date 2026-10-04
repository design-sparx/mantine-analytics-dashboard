import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('marketing-stats.json', 'Marketing stats');
}
