import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('property-listings.json', 'Property listings');
}
