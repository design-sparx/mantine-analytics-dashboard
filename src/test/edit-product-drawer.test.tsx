import { MantineProvider } from '@mantine/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import EditProductDrawer from '@/app/apps/products/components/EditProductDrawer';

import type { IProduct } from '@/types/products';
import type { Mock } from 'vitest';

/**
 * Regression for https://github.com/design-sparx/mantine-analytics-dashboard/issues/168
 *
 * The drawer must address the per-product write endpoint from the shared
 * registry. It used to PUT/DELETE the collection endpoint, which the write
 * layer resolved to the id "products" and 404'd on.
 */
const product: IProduct = {
  id: 'prod-001',
  title: 'Wireless Bluetooth Headphones',
  description: 'Premium noise-canceling wireless headphones',
  price: 149.99,
  quantityInStock: 45,
  sku: 'WBH-001-BLK',
  imageUrl: 'https://example.com/headphones.jpg',
  isActive: true,
  status: 1,
  categoryId: 'cat-001',
  created: '2024-01-15T08:30:00Z',
  modified: '2024-11-20T14:22:00Z',
} as unknown as IProduct;

const envelope = <T,>(data: T) => ({
  succeeded: true,
  data,
  errors: [],
  message: 'ok',
  timestamp: new Date().toISOString(),
});

/** Answers the categories read and echoes writes back as a success. */
const stubFetch = (): Mock =>
  vi.fn(async (input: RequestInfo | URL, _init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/api/product-categories')) {
      return new Response(JSON.stringify(envelope([])), { status: 200 });
    }
    return new Response(JSON.stringify(envelope(product)), { status: 200 });
  });

const renderDrawer = () =>
  render(
    <MantineProvider>
      <EditProductDrawer
        opened
        product={product}
        onClose={() => {}}
        onProductUpdated={() => {}}
      />
    </MantineProvider>,
  );

const waitForReady = async () => {
  // Buttons enable once the creator effect runs.
  const submit = await screen.findByRole('button', { name: /update product/i });
  await waitFor(() => expect(submit).toBeEnabled());
  // Form is prefilled from the product prop by an effect.
  await waitFor(() =>
    expect(screen.getByDisplayValue(product.title)).toBeInTheDocument(),
  );
};

const writeCalls = (fetchMock: Mock) =>
  fetchMock.mock.calls.filter((call) => {
    const init = call[1] as RequestInit | undefined;
    const url = String(call[0]);
    return url.startsWith('/api/products') && init?.method !== 'GET';
  });

describe('EditProductDrawer write endpoints', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('submits an edit to the per-product endpoint', async () => {
    const fetchMock = stubFetch();
    vi.stubGlobal('fetch', fetchMock);

    const user = userEvent.setup();
    renderDrawer();
    await waitForReady();

    const title = screen.getByDisplayValue(product.title);
    await user.clear(title);
    await user.type(title, 'Edited title');
    await user.click(screen.getByRole('button', { name: /update product/i }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/products/prod-001',
        expect.objectContaining({ method: 'PUT' }),
      ),
    );

    const putCall = fetchMock.mock.calls.find(
      (call) => call[0] === '/api/products/prod-001',
    );
    const requestInit = putCall?.[1] as RequestInit | undefined;
    expect(JSON.parse(String(requestInit?.body)).title).toBe('Edited title');
  });

  it('submits a delete to the per-product endpoint', async () => {
    const fetchMock = stubFetch();
    vi.stubGlobal('fetch', fetchMock);
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    const user = userEvent.setup();
    renderDrawer();
    await waitForReady();

    await user.click(screen.getByRole('button', { name: /delete product/i }));

    await waitFor(() => expect(confirmSpy).toHaveBeenCalled());
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/products/prod-001',
        expect.objectContaining({ method: 'DELETE' }),
      ),
    );
  });

  it('never addresses the collection endpoint for a write', async () => {
    const fetchMock = stubFetch();
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const user = userEvent.setup();
    renderDrawer();
    await waitForReady();

    await user.click(screen.getByRole('button', { name: /delete product/i }));
    await waitFor(() =>
      expect(writeCalls(fetchMock).length).toBeGreaterThan(0),
    );

    expect(
      writeCalls(fetchMock).every((call) => call[0] !== '/api/products'),
    ).toBe(true);
  });
});
