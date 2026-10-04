import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('employee-distribution.json', 'Employee distribution');
}
