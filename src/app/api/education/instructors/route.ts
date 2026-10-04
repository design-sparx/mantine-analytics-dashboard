import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('instructor-performance.json', 'Instructor performance data');
}
