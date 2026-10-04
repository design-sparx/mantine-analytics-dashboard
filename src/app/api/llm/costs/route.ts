import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('cost-analysis.json', 'Cost analysis');
}
