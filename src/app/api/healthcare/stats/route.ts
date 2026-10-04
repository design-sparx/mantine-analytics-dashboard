import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('healthcare-stats.json', 'Healthcare stats');
}
