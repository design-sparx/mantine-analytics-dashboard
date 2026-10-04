import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('fleet-status.json', 'Fleet status');
}
