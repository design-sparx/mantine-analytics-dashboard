import { describe, expect, it } from 'vitest';

import { buildWriteRoute, buildReadRoute } from '@/lib/api/mock-write-route';

const FIXTURE = 'KanbanTasks.json';

describe('mock-write-route', () => {
  it('returns 405 for unsupported method on read route', async () => {
    const handler = buildReadRoute(FIXTURE);
    const response = await handler(
      new Request('http://localhost/api/tasks', { method: 'POST' }),
    );
    expect(response.status).toBe(405);
  });

  it('returns 405 for unsupported method on write route', async () => {
    const handler = buildWriteRoute('POST', FIXTURE);
    const response = await handler(
      new Request('http://localhost/api/tasks/unknown', { method: 'PATCH' }),
    );
    expect(response.status).toBe(405);
  });

  it('POST creates and returns the new entity', async () => {
    const handler = buildWriteRoute('POST', FIXTURE);
    const response = await handler(
      new Request('http://localhost/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Write test task', status: 'todo' }),
      }),
    );
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.succeeded).toBe(true);
    expect(body.data.title).toBe('Write test task');
    expect(body.data.id).toBeDefined();
  });

  it('PUT updates and returns the patched entity', async () => {
    const handler = buildWriteRoute('PUT', FIXTURE, ':id');
    const response = await handler(
      new Request('http://localhost/api/tasks/existing-id', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated' }),
      }),
      { params: Promise.resolve({ id: 'existing-id' }) },
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.succeeded).toBe(true);
    expect(body.data.title).toBe('Updated');
  });

  it('DELETE returns 200 with success envelope', async () => {
    const handler = buildWriteRoute('DELETE', FIXTURE, ':id');
    const response = await handler(
      new Request('http://localhost/api/tasks/existing-id', {
        method: 'DELETE',
      }),
      { params: Promise.resolve({ id: 'existing-id' }) },
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.succeeded).toBe(true);
  });

  it('returns 404 when detail target is missing', async () => {
    const handler = buildWriteRoute('PUT', FIXTURE, ':id');
    const response = await handler(
      new Request('http://localhost/api/tasks/missing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'X' }),
      }),
      { params: Promise.resolve({ id: 'missing' }) },
    );
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.succeeded).toBe(false);
  });
});
