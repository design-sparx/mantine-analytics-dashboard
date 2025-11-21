import {
  type ApiResponse,
  apiDelete,
  apiPost,
  apiPut,
  type components,
  useApiGet,
} from './api-utils';

// Type aliases from OpenAPI
type OrderDto = components['schemas']['OrderDto'];

// Endpoints
const ENDPOINTS = {
  list: '/api/v1/mantine/orders',
  byId: (id: string) => `/api/v1/mantine/orders/${id}`,
  create: '/api/v1/mantine/orders',
  update: (id: string) => `/api/v1/mantine/orders/${id}`,
  delete: (id: string) => `/api/v1/mantine/orders/${id}`,
} as const;

// Hooks
export function useOrders(options?: {
  page?: number;
  limit?: number;
  enabled?: boolean;
}) {
  const { page, limit, enabled = true } = options || {};

  return useApiGet<OrderDto[]>(ENDPOINTS.list, {
    params: { Page: page, Limit: limit },
    enabled,
    permission: 'Permissions.Team.Orders', // RBAC permission check
  });
}

export function useOrder(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<OrderDto>(ENDPOINTS.byId(id), {
    enabled: enabled && !!id,
    permission: 'Permissions.Team.Orders', // RBAC permission check
  });
}

// Mutations with RBAC
export async function createOrder(
  data: Partial<OrderDto>,
): Promise<ApiResponse<OrderDto>> {
  return apiPost<OrderDto>(ENDPOINTS.create, data, {
    permission: 'Permissions.Team.Orders', // RBAC permission check
  });
}

export async function updateOrder(
  id: string,
  data: Partial<OrderDto>,
): Promise<ApiResponse<OrderDto>> {
  return apiPut<OrderDto>(ENDPOINTS.update(id), data, {
    permission: 'Permissions.Team.Orders', // RBAC permission check
  });
}

export async function deleteOrder(id: string): Promise<ApiResponse<any>> {
  return apiDelete(ENDPOINTS.delete(id), {
    permission: 'Permissions.Team.Orders', // RBAC permission check
  });
}

// Combined hook with mutations for convenience
export function useOrdersWithMutations() {
  const ordersQuery = useOrders();

  const mutations = {
    create: async (data: Partial<OrderDto>) => {
      const result = await createOrder(data);
      ordersQuery.refetch(); // Refresh the list
      return result;
    },

    update: async (id: string, data: Partial<OrderDto>) => {
      const result = await updateOrder(id, data);
      ordersQuery.refetch(); // Refresh the list
      return result;
    },

    delete: async (id: string) => {
      const result = await deleteOrder(id);
      ordersQuery.refetch(); // Refresh the list
      return result;
    },
  };

  return {
    ...ordersQuery,
    mutations,
  };
}
