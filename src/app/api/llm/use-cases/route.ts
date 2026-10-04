import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('use-case-distribution.json', 'Use case distribution');
}
