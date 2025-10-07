import {
  type ApiResponse,
  apiDelete,
  apiPost,
  apiPut,
  type components,
  useApiGet,
} from './api-utils';

// Type aliases from OpenAPI
type InvoiceDto = components['schemas']['InvoiceDto'];
type InvoiceDto2 = components['schemas']['InvoiceDto2'];
type InvoiceListResponse = components['schemas']['InvoiceListResponse'];
type InvoiceResponse = components['schemas']['InvoiceResponse'];
type InvoiceCreateResponse = components['schemas']['InvoiceCreateResponse'];
type InvoiceUpdateResponse = components['schemas']['InvoiceUpdateResponse'];
type InvoiceDeleteResponse = components['schemas']['InvoiceDeleteResponse'];

// Endpoints
const ENDPOINTS = {
  list: '/api/v1/mantine/invoices',
  byId: (id: string) => `/api/v1/mantine/invoices/${id}`,
  create: '/api/v1/mantine/invoices',
  update: (id: string) => `/api/v1/mantine/invoices/${id}`,
  delete: (id: string) => `/api/v1/mantine/invoices/${id}`,
} as const;

// Hooks
export function useInvoices(options?: {
  page?: number;
  limit?: number;
  enabled?: boolean;
}) {
  const { page, limit, enabled = true } = options || {};

  // Return the array directly as per actual API response
  return useApiGet<InvoiceDto[]>(ENDPOINTS.list, {
    params: { Page: page, Limit: limit },
    enabled,
    permission: 'Permissions.Personal.Invoices', // RBAC permission check
  });
}

export function useInvoice(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<InvoiceResponse>(ENDPOINTS.byId(id), {
    enabled: enabled && !!id,
    permission: 'Permissions.Personal.Invoices', // RBAC permission check
  });
}

// Mutations with RBAC
export async function createInvoice(
  data: InvoiceDto,
): Promise<ApiResponse<InvoiceCreateResponse>> {
  return apiPost<InvoiceCreateResponse>(ENDPOINTS.create, data, {
    permission: 'Permissions.Personal.Invoices', // RBAC permission check
  });
}

export async function updateInvoice(
  id: string,
  data: Partial<InvoiceDto>,
): Promise<ApiResponse<InvoiceUpdateResponse>> {
  return apiPut<InvoiceUpdateResponse>(ENDPOINTS.update(id), data, {
    permission: 'Permissions.Personal.Invoices', // RBAC permission check
  });
}

export async function deleteInvoice(
  id: string,
): Promise<ApiResponse<InvoiceDeleteResponse>> {
  return apiDelete<InvoiceDeleteResponse>(ENDPOINTS.delete(id), {
    permission: 'Permissions.Personal.Invoices', // RBAC permission check
  });
}

// Combined hook with mutations for convenience
export function useInvoicesWithMutations() {
  const invoicesQuery = useInvoices();

  const mutations = {
    create: async (data: InvoiceDto) => {
      const result = await createInvoice(data);
      invoicesQuery.refetch(); // Refresh the list
      return result;
    },

    update: async (id: string, data: Partial<InvoiceDto>) => {
      const result = await updateInvoice(id, data);
      invoicesQuery.refetch(); // Refresh the list
      return result;
    },

    delete: async (id: string) => {
      const result = await deleteInvoice(id);
      invoicesQuery.refetch(); // Refresh the list
      return result;
    },
  };

  return {
    ...invoicesQuery,
    mutations,
  };
}
