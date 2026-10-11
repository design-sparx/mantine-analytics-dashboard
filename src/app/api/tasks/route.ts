import { buildReadRoute, buildWriteRoute } from '@/lib/api/mock-write-route';

export const GET = buildReadRoute('KanbanTasks.json');
export const POST = buildWriteRoute('POST', 'KanbanTasks.json');
export const PUT = buildWriteRoute('PUT', 'KanbanTasks.json');
export const DELETE = buildWriteRoute('DELETE', 'KanbanTasks.json');
