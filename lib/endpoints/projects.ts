import {
  type ApiResponse,
  apiDelete,
  apiPost,
  apiPut,
  type components,
  useApiGet,
} from './api-utils';

// Type aliases from OpenAPI
type ProjectDto = components['schemas']['ProjectDto'];

// Endpoints
const ENDPOINTS = {
  list: '/api/v1/mantine/projects',
  byId: (id: number) => `/api/v1/mantine/projects/${id}`,
  create: '/api/v1/mantine/projects',
  update: (id: number) => `/api/v1/mantine/projects/${id}`,
  delete: (id: number) => `/api/v1/mantine/projects/${id}`,
} as const;

// Hooks
export function useProjects(options?: {
  page?: number;
  limit?: number;
  enabled?: boolean;
}) {
  const { page, limit, enabled = true } = options || {};

  return useApiGet<ProjectDto[]>(ENDPOINTS.list, {
    params: { Page: page, Limit: limit },
    enabled,
  });
}

export function useProject(id: number, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<ProjectDto>(ENDPOINTS.byId(id), {
    enabled: enabled && !!id,
  });
}

// Mutations
export async function createProject(
  data: Partial<ProjectDto>,
): Promise<ApiResponse<ProjectDto>> {
  return apiPost<ProjectDto>(ENDPOINTS.create, data);
}

export async function updateProject(
  id: number,
  data: Partial<ProjectDto>,
): Promise<ApiResponse<ProjectDto>> {
  return apiPut<ProjectDto>(ENDPOINTS.update(id), data);
}

export async function deleteProject(id: number): Promise<ApiResponse<any>> {
  return apiDelete(ENDPOINTS.delete(id));
}

// Combined hook with mutations for convenience
export function useProjectsWithMutations() {
  const projectsQuery = useProjects();

  const mutations = {
    create: async (data: Partial<ProjectDto>) => {
      const result = await createProject(data);
      projectsQuery.refetch();
      return result;
    },

    update: async (id: number, data: Partial<ProjectDto>) => {
      const result = await updateProject(id, data);
      projectsQuery.refetch();
      return result;
    },

    delete: async (id: number) => {
      const result = await deleteProject(id);
      projectsQuery.refetch();
      return result;
    },
  };

  return {
    ...projectsQuery,
    mutations,
  };
}
