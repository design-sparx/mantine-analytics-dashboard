import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('student-enrollment.json', 'Student enrollment data');
}
