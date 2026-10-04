import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('education-stats.json', 'Education stats');
}
