import fs from 'fs';

import { describe, expect, it, vi } from 'vitest';

import { apiFailure, apiSuccess, serveMock } from '@/lib/api/mock-route';

import type { IApiResponse } from '@/types/api-response';

type Envelope = IApiResponse<unknown>;

const isEnvelope = (value: unknown): value is Envelope => {
  const body = value as Envelope;
  return (
    typeof body.succeeded === 'boolean' &&
    typeof body.message === 'string' &&
    typeof body.timestamp === 'string' &&
    Array.isArray(body.errors)
  );
};

describe('serveMock', () => {
  it('returns the parsed fixture in a success envelope', async () => {
    const response = await serveMock<unknown[]>('Invoices.json', 'invoices');
    const body = (await response.json()) as Envelope;

    expect(response.status).toBe(200);
    expect(isEnvelope(body)).toBe(true);
    expect(body.succeeded).toBe(true);
    expect(body.errors).toEqual([]);
    expect(Array.isArray(body.data)).toBe(true);
    expect((body.data as unknown[]).length).toBeGreaterThan(0);
  });

  it('derives the success message from the resource label', async () => {
    const response = await serveMock('Invoices.json', 'invoices');
    const body = (await response.json()) as Envelope;

    expect(body.message).toBe('invoices retrieved successfully');
  });

  it('returns the failure envelope when the fixture is missing', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await serveMock('DoesNotExist.json', 'widgets');
    const body = (await response.json()) as Envelope;

    expect(response.status).toBe(500);
    expect(isEnvelope(body)).toBe(true);
    expect(body.succeeded).toBe(false);
    expect(body.data).toBeNull();
    expect(body.errors).toEqual(['Failed to fetch widgets']);
    expect(body.message).toBe('Failed to fetch widgets');
    expect(spy).toHaveBeenCalled();
  });

  it('returns the failure envelope rather than throwing on malformed JSON', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(fs.promises, 'readFile').mockResolvedValue('{ not json');

    const response = await serveMock('Invoices.json', 'invoices');
    const body = (await response.json()) as Envelope;

    expect(response.status).toBe(500);
    expect(body.succeeded).toBe(false);
    expect(body.data).toBeNull();
    expect(body.errors).toHaveLength(1);
  });

  it('refuses to read a fixture outside the mocks root', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const read = vi.spyOn(fs.promises, 'readFile');

    const response = await serveMock('../../../package.json', 'packages');
    const body = (await response.json()) as Envelope;

    expect(response.status).toBe(500);
    expect(body.succeeded).toBe(false);
    expect(body.errors).toEqual(['Failed to fetch packages']);
    // Rejected before any read, so the traversal never reaches the filesystem.
    expect(read).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('never leaks a filesystem path in the response body', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await serveMock('DoesNotExist.json', 'widgets');
    const raw = JSON.stringify(await response.json());

    expect(raw).not.toContain('mocks');
    expect(raw).not.toContain('public');
    expect(raw).not.toContain('.json');
    expect(raw).not.toContain(process.cwd());
  });

  it('stamps every envelope with a parseable ISO timestamp', async () => {
    const response = await serveMock('Invoices.json', 'invoices');
    const body = (await response.json()) as Envelope;

    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });
});

describe('apiSuccess', () => {
  it('defaults to 200 and an empty error list', async () => {
    const response = apiSuccess({ id: 1 }, 'thing retrieved successfully');
    const body = (await response.json()) as Envelope;

    expect(response.status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.errors).toEqual([]);
    expect(body.data).toEqual({ id: 1 });
  });

  it('honours an explicit status', () => {
    expect(apiSuccess({}, 'created', 201).status).toBe(201);
  });
});

describe('apiFailure', () => {
  it('defaults to 500 with a null payload', async () => {
    const response = apiFailure('Failed to do thing');
    const body = (await response.json()) as Envelope;

    expect(response.status).toBe(500);
    expect(body.succeeded).toBe(false);
    expect(body.data).toBeNull();
    expect(body.message).toBe('Failed to do thing');
    expect(body.errors).toEqual(['Failed to do thing']);
  });

  it('honours an explicit status', () => {
    expect(apiFailure('Bad request', 'Invalid name', 400).status).toBe(400);
  });

  it('carries a distinct error when the failure has extra detail', async () => {
    const response = apiFailure(
      'Could not create invoice',
      'name is required',
      400,
    );
    const body = (await response.json()) as Envelope;

    expect(body.message).toBe('Could not create invoice');
    expect(body.errors).toEqual(['name is required']);
  });
});
