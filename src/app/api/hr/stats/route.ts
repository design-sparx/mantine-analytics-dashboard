import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('hr-stats.json', 'HR stats');
}
