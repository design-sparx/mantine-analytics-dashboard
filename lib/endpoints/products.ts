import {
  type ApiResponse,
  apiDelete,
  apiPost,
  apiPut,
  type components,
  useApiGet,
} from './api-utils';

// Type aliases from OpenAPI (adjust based on your actual schema names)
type ProductDto = components['schemas']['ProductDto'];

// Endpoints
const ENDPOINTS = {
  list: '/api/products',
  byId: (id: string) => `/api/products/${id}`,
  create: '/api/products',
  update: (id: string) => `/api/products/${id}`,
  delete: (id: string) => `/api/products/${id}`,
} as const;

// Hooks
export function useProducts(options?: {
  page?: number;
  limit?: number;
  enabled?: boolean;
}) {
  const { page, limit, enabled = true } = options || {};

  return useApiGet<ProductDto[]>(ENDPOINTS.list, {
    params: { Page: page, Limit: limit },
    enabled,
  });
}

export function useProduct(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<ProductDto>(ENDPOINTS.byId(id), {
    enabled: enabled && !!id,
  });
}

// Mutations
export async function createProduct(
  data: Partial<ProductDto>,
): Promise<ApiResponse<ProductDto>> {
  return apiPost<ProductDto>(ENDPOINTS.create, data);
}

export async function updateProduct(
  id: string,
  data: Partial<ProductDto>,
): Promise<ApiResponse<ProductDto>> {
  return apiPut<ProductDto>(ENDPOINTS.update(id), data);
}

export async function deleteProduct(id: string): Promise<ApiResponse<any>> {
  return apiDelete(ENDPOINTS.delete(id));
}

// Combined hook with mutations for convenience
export function useProductsWithMutations() {
  const productsQuery = useProducts();

  const mutations = {
    create: async (data: Partial<ProductDto>) => {
      const result = await createProduct(data);
      productsQuery.refetch();
      return result;
    },

    update: async (id: string, data: Partial<ProductDto>) => {
      const result = await updateProduct(id, data);
      productsQuery.refetch();
      return result;
    },

    delete: async (id: string) => {
      const result = await deleteProduct(id);
      productsQuery.refetch();
      return result;
    },
  };

  return {
    ...productsQuery,
    mutations,
  };
}
