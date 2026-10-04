import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('patient-satisfaction.json', 'Patient satisfaction data');
}
