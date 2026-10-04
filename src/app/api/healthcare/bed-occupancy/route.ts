import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('bed-occupancy.json', 'Bed occupancy data');
}
