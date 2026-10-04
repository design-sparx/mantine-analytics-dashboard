import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('llm-stats.json', 'LLM stats');
}
