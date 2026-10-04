import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('student-activity.json', 'Student activity data');
}
