import {
  type ApiResponse,
  apiDelete,
  apiPost,
  apiPut,
  type components,
  useApiGet,
} from './api-utils';

// Type aliases from OpenAPI
type KanbanTaskDto = components['schemas']['KanbanTaskDto'];

// Endpoints
const ENDPOINTS = {
  list: '/api/v1/mantine/kanban-tasks',
  byId: (id: string) => `/api/v1/mantine/kanban-tasks/${id}`,
  create: '/api/v1/mantine/kanban-tasks',
  update: (id: string) => `/api/v1/mantine/kanban-tasks/${id}`,
  delete: (id: string) => `/api/v1/mantine/kanban-tasks/${id}`,
} as const;

// Hooks
export function useKanbanTasks(options?: {
  page?: number;
  limit?: number;
  enabled?: boolean;
}) {
  const { page, limit, enabled = true } = options || {};

  return useApiGet<KanbanTaskDto[]>(ENDPOINTS.list, {
    params: { Page: page, Limit: limit },
    enabled,
    permission: 'Permissions.Team.Projects', // RBAC permission check (kanban tasks are part of projects)
  });
}

export function useKanbanTask(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<KanbanTaskDto>(ENDPOINTS.byId(id), {
    enabled: enabled && !!id,
    permission: 'Permissions.Team.Projects', // RBAC permission check
  });
}

// Mutations with RBAC
export async function createKanbanTask(
  data: Partial<KanbanTaskDto>,
): Promise<ApiResponse<KanbanTaskDto>> {
  return apiPost<KanbanTaskDto>(ENDPOINTS.create, data, {
    permission: 'Permissions.Team.Projects', // RBAC permission check
  });
}

export async function updateKanbanTask(
  id: string,
  data: Partial<KanbanTaskDto>,
): Promise<ApiResponse<KanbanTaskDto>> {
  return apiPut<KanbanTaskDto>(ENDPOINTS.update(id), data, {
    permission: 'Permissions.Team.Projects', // RBAC permission check
  });
}

export async function deleteKanbanTask(id: string): Promise<ApiResponse<any>> {
  return apiDelete(ENDPOINTS.delete(id), {
    permission: 'Permissions.Team.Projects', // RBAC permission check
  });
}

// Combined hook with mutations for convenience
export function useKanbanTasksWithMutations() {
  const tasksQuery = useKanbanTasks();

  const mutations = {
    create: async (data: Partial<KanbanTaskDto>) => {
      const result = await createKanbanTask(data);
      tasksQuery.refetch(); // Refresh the list
      return result;
    },

    update: async (
      id: string,
      data: Partial<KanbanTaskDto>,
      options?: { skipRefetch?: boolean },
    ) => {
      const result = await updateKanbanTask(id, data);
      if (!options?.skipRefetch) {
        tasksQuery.refetch(); // Refresh the list only if not skipped
      }
      return result;
    },

    delete: async (id: string) => {
      const result = await deleteKanbanTask(id);
      tasksQuery.refetch(); // Refresh the list
      return result;
    },
  };

  return {
    ...tasksQuery,
    mutations,
  };
}
