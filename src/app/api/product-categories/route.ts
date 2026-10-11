import { buildReadRoute, buildWriteRoute } from '@/lib/api/mock-write-route';

const FIXTURE = 'ProductCategories.json';

export const GET = buildReadRoute(FIXTURE);

export const POST = buildWriteRoute('POST', FIXTURE);

export const PUT = buildWriteRoute('PUT', FIXTURE);

export const DELETE = buildWriteRoute('DELETE', FIXTURE);
