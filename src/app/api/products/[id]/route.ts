import { apiFailure, apiSuccess } from '@/lib/api/mock-route';
import { mockStore } from '@/lib/api/mock-store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const product = await mockStore.getById('Products.json', id);

    if (!product) {
      return apiFailure(
        'Product not found',
        `Not found: Products.json#${id}`,
        404,
      );
    }

    return apiSuccess(product, 'Retrieved successfully');
  } catch (error) {
    return apiFailure((error as Error).message);
  }
}

export const PUT = async (
  request: Request,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;

  try {
    const body = await request.json().catch(() => ({}));
    const updated = await mockStore.update('Products.json', id, body);
    return apiSuccess(updated, 'Updated successfully');
  } catch (error) {
    const err = error as Error & { status?: number };
    const status = err.status === 404 ? 404 : 500;
    return apiFailure(err.message, err.message, status);
  }
};

export const DELETE = async (
  _request: Request,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;

  try {
    await mockStore.delete('Products.json', id);
    return apiSuccess({ id }, 'Deleted successfully', 200);
  } catch (error) {
    const err = error as Error & { status?: number };
    const status = err.status === 404 ? 404 : 500;
    return apiFailure(err.message, err.message, status);
  }
};
