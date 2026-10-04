import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('ChatItems.json', 'Chat messages');
}
