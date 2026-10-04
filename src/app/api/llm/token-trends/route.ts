import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('token-usage-trends.json', 'Token usage trends');
}
