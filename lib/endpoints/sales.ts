import {
  type ApiResponse,
  apiDelete,
  apiPost,
  apiPut,
  type components,
  useApiGet,
} from './api-utils';

// Type aliases from OpenAPI
type SalesDto = components['schemas']['SalesDto'];

// Endpoints
const ENDPOINTS = {
  list: '/api/v1/mantine/sales',
  byId: (id: number) => `/api/v1/mantine/sales/${id}`,
  create: '/api/v1/mantine/sales',
  update: (id: number) => `/api/v1/mantine/sales/${id}`,
  delete: (id: number) => `/api/v1/mantine/sales/${id}`,
} as const;

// Hooks
export function useSales(options?: {
  page?: number;
  limit?: number;
  enabled?: boolean;
}) {
  const { page, limit, enabled = true } = options || {};

  return useApiGet<SalesDto[]>(ENDPOINTS.list, {
    params: { Page: page, Limit: limit },
    enabled,
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Dashboard.Sales',
  });
}

export function useSale(id: number, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<SalesDto>(ENDPOINTS.byId(id), {
    enabled: enabled && !!id,
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Dashboard.Sales',
  });
}

// Mutations
export async function createSale(
  data: Partial<SalesDto>,
): Promise<ApiResponse<SalesDto>> {
  return apiPost<SalesDto>(ENDPOINTS.create, data, {
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Dashboard.Sales',
  });
}

export async function updateSale(
  id: number,
  data: Partial<SalesDto>,
): Promise<ApiResponse<SalesDto>> {
  return apiPut<SalesDto>(ENDPOINTS.update(id), data, {
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Dashboard.Sales',
  });
}

export async function deleteSale(id: number): Promise<ApiResponse<any>> {
  return apiDelete<any>(ENDPOINTS.delete(id), {
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Dashboard.Sales',
  });
}

// Combined hook with mutations for convenience
export function useSalesWithMutations() {
  const salesQuery = useSales();

  const mutations = {
    create: async (data: Partial<SalesDto>) => {
      const result = await createSale(data);
      salesQuery.refetch();
      return result;
    },

    update: async (id: number, data: Partial<SalesDto>) => {
      const result = await updateSale(id, data);
      salesQuery.refetch();
      return result;
    },

    delete: async (id: number) => {
      const result = await deleteSale(id);
      salesQuery.refetch();
      return result;
    },
  };

  return {
    ...salesQuery,
    mutations,
  };
}
