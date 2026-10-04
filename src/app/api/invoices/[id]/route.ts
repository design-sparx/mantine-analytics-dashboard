import { apiFailure, apiSuccess } from '@/lib/api/mock-route';
import { mockStore } from '@/lib/api/mock-store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const invoice = await mockStore.getById('Invoices.json', id);

    if (!invoice) {
      return apiFailure(
        'Invoice not found',
        `Not found: Invoices.json#${id}`,
        404,
      );
    }

    return apiSuccess(invoice, 'Retrieved successfully');
  } catch (error) {
    return apiFailure((error as Error).message);
  }
}
