import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock(
    'department-performance.json',
    'Department performance data',
  );
}
