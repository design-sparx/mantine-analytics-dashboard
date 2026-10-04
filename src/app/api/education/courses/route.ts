import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('course-completion.json', 'Course completion data');
}
