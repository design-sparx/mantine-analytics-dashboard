import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('recruitment-pipeline.json', 'Recruitment pipeline');
}
