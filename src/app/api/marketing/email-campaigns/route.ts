import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('email-campaigns.json', 'Email campaigns');
}
