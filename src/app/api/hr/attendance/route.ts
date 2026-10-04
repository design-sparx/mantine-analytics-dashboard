import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('attendance-data.json', 'Attendance data');
}
