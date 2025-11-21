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
export function useTasks(options?: {
  page?: number;
  limit?: number;
  status?: string;
  enabled?: boolean;
}) {
  const { page, limit, status, enabled = true } = options || {};

  return useApiGet<KanbanTaskDto[]>(ENDPOINTS.list, {
    params: { Page: page, Limit: limit, Status: status },
    enabled,
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Tasks.Read',
  });
}

export function useTask(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<KanbanTaskDto>(ENDPOINTS.byId(id), {
    enabled: enabled && !!id,
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Tasks.Read',
  });
}

// Mutations
export async function createTask(
  data: Partial<KanbanTaskDto>,
): Promise<ApiResponse<KanbanTaskDto>> {
  return apiPost<KanbanTaskDto>(ENDPOINTS.create, data, {
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Tasks.Create',
  });
}

export async function updateTask(
  id: string,
  data: Partial<KanbanTaskDto>,
): Promise<ApiResponse<KanbanTaskDto>> {
  return apiPut<KanbanTaskDto>(ENDPOINTS.update(id), data, {
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Tasks.Update',
  });
}

export async function deleteTask(id: string): Promise<ApiResponse<any>> {
  return apiDelete<any>(ENDPOINTS.delete(id), {
    // Add permission when defined in RBAC config
    // permission: 'Permissions.Tasks.Delete',
  });
}

// Combined hook with mutations for convenience
export function useTasksWithMutations() {
  const tasksQuery = useTasks();

  const mutations = {
    create: async (data: Partial<KanbanTaskDto>) => {
      const result = await createTask(data);
      tasksQuery.refetch();
      return result;
    },

    update: async (id: string, data: Partial<KanbanTaskDto>) => {
      const result = await updateTask(id, data);
      tasksQuery.refetch();
      return result;
    },

    delete: async (id: string) => {
      const result = await deleteTask(id);
      tasksQuery.refetch();
      return result;
    },
  };

  return {
    ...tasksQuery,
    mutations,
  };
}
