import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('social-media-stats.json', 'Social media stats');
}
