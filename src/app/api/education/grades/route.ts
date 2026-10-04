import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('grade-distribution.json', 'Grade distribution data');
}
