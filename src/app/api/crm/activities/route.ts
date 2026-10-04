import { serveMock } from '@/lib/api/mock-route';

export async function GET() {
  return serveMock('crm-activities.json', 'CRM activities');
}
