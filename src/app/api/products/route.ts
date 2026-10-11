import { buildReadRoute, buildWriteRoute } from '@/lib/api/mock-write-route';

export const GET = buildReadRoute('Products.json');
export const POST = buildWriteRoute('POST', 'Products.json');
export const PUT = buildWriteRoute('PUT', 'Products.json');
export const DELETE = buildWriteRoute('DELETE', 'Products.json');
