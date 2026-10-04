import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('medical-inventory.json', 'Medical inventory');
}
