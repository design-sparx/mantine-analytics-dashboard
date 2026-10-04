import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('patient-appointments.json', 'Patient appointments');
}
