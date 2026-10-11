import { describe, expect, it } from 'vitest';

import * as productDetailRoute from '@/app/api/products/[id]/route';
import * as productCollectionRoute from '@/app/api/products/route';

const envelopeOf = async (response: Response) => {
  const body = await response.json();
  return { status: response.status, body };
};

const jsonRequest = (url: string, method: string, body?: unknown) =>
  new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

/**
 * Regression for https://github.com/design-sparx/mantine-analytics-dashboard/issues/168
 *
 * The edit/delete drawer used to target the product collection endpoint with no
 * id. The write layer guessed the id from the last URL segment, which resolved
 * to the string "products", so every edit and delete failed. These tests pin
 * the correct per-product write path and the failure mode when no id is given.
 */
describe('product write routes', () => {
  it('PUT updates a product addressed by id', async () => {
    // Create a record so the test is isolated from fixture contents.
    const created = await productCollectionRoute.POST(
      jsonRequest('http://localhost/api/products', 'POST', {
        title: 'Product to edit',
        description: 'Original description',
        price: 10,
        quantityInStock: 1,
        sku: 'EDIT-001',
        isActive: true,
        status: 1,
        categoryId: 'cat-001',
      }),
    );
    const { body: createdBody } = await envelopeOf(created);
    expect(created.status).toBe(201);
    const id = createdBody.data.id as string;
    expect(id).toBeDefined();

    const response = await productDetailRoute.PUT(
      jsonRequest(`http://localhost/api/products/${id}`, 'PUT', {
        title: 'Edited title',
      }),
      { params: Promise.resolve({ id }) },
    );

    const { status, body } = await envelopeOf(response);
    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data.title).toBe('Edited title');
  });

  it('DELETE removes a product addressed by id', async () => {
    const created = await productCollectionRoute.POST(
      jsonRequest('http://localhost/api/products', 'POST', {
        title: 'Product to delete',
        description: 'Original description',
        price: 10,
        quantityInStock: 1,
        sku: 'DELETE-001',
        isActive: true,
        status: 1,
        categoryId: 'cat-001',
      }),
    );
    const { body: createdBody } = await envelopeOf(created);
    const id = createdBody.data.id as string;

    const response = await productDetailRoute.DELETE(
      jsonRequest(`http://localhost/api/products/${id}`, 'DELETE'),
      { params: Promise.resolve({ id }) },
    );

    const { status, body } = await envelopeOf(response);
    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);

    const missing = await productDetailRoute.GET(
      jsonRequest(`http://localhost/api/products/${id}`, 'GET'),
      { params: Promise.resolve({ id }) },
    );
    expect(missing.status).toBe(404);
  });

  it('PUT without an id fails cleanly instead of guessing a record', async () => {
    const response = await productCollectionRoute.PUT(
      jsonRequest('http://localhost/api/products', 'PUT', { title: 'No id' }),
    );

    const { status, body } = await envelopeOf(response);
    expect(body.succeeded).toBe(false);
    expect(status).toBe(400);
    expect(body.errors.join(' ')).toContain('id');
  });

  it('DELETE without an id fails cleanly instead of guessing a record', async () => {
    const response = await productCollectionRoute.DELETE(
      jsonRequest('http://localhost/api/products', 'DELETE'),
    );

    const { status, body } = await envelopeOf(response);
    expect(body.succeeded).toBe(false);
    expect(status).toBe(400);
  });
});
