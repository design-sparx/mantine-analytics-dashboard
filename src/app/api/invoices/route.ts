import { buildReadRoute, buildWriteRoute } from '@/lib/api/mock-write-route';

export const GET = buildReadRoute('Invoices.json');
export const POST = buildWriteRoute('POST', 'Invoices.json');
export const PUT = buildWriteRoute('PUT', 'Invoices.json');
export const DELETE = buildWriteRoute('DELETE', 'Invoices.json');
