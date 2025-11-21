import {
  type ApiResponse,
  apiDelete,
  apiPost,
  apiPut,
  type components,
  useApiGet,
} from './api-utils';

// Type aliases from OpenAPI
type ChatDto = components['schemas']['ChatDto'];
type ChatMessageDto = components['schemas']['ChatMessageDto'];

// Endpoints
const ENDPOINTS = {
  chats: {
    list: '/api/v1/mantine/chats',
    byId: (id: string) => `/api/v1/mantine/chats/${id}`,
    create: '/api/v1/mantine/chats',
    update: (id: string) => `/api/v1/mantine/chats/${id}`,
    delete: (id: string) => `/api/v1/mantine/chats/${id}`,
  },
  messages: {
    list: '/api/v1/mantine/chat-items',
    byId: (id: string) => `/api/v1/mantine/chat-items/${id}`,
    create: '/api/v1/mantine/chat-items',
    delete: (id: string) => `/api/v1/mantine/chat-items/${id}`,
  },
} as const;

// Chat Hooks
export function useChats(options?: {
  page?: number;
  limit?: number;
  type?: string;
  enabled?: boolean;
}) {
  const { page, limit, type, enabled = true } = options || {};

  return useApiGet<ChatDto[]>(ENDPOINTS.chats.list, {
    params: { Page: page, Limit: limit, Type: type },
    enabled,
    permission: 'Permissions.Team.Projects', // RBAC permission check
  });
}

export function useChat(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<ChatDto>(ENDPOINTS.chats.byId(id), {
    enabled: enabled && !!id,
    permission: 'Permissions.Team.Projects', // RBAC permission check
  });
}

// Message Hooks
export function useChatMessages(options?: {
  page?: number;
  limit?: number;
  chatId?: string;
  senderId?: string;
  messageType?: string;
  enabled?: boolean;
}) {
  const {
    page,
    limit,
    chatId,
    senderId,
    messageType,
    enabled = true,
  } = options || {};

  return useApiGet<ChatMessageDto[]>(ENDPOINTS.messages.list, {
    params: {
      Page: page,
      Limit: limit,
      ChatId: chatId,
      SenderId: senderId,
      MessageType: messageType,
    },
    enabled,
    permission: 'Permissions.Team.Projects', // RBAC permission check
  });
}

export function useChatMessage(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useApiGet<ChatMessageDto>(ENDPOINTS.messages.byId(id), {
    enabled: enabled && !!id,
    permission: 'Permissions.Team.Projects', // RBAC permission check
  });
}

// Chat Mutations
export async function createChat(
  data: Partial<ChatDto>,
): Promise<ApiResponse<ChatDto>> {
  return apiPost<ChatDto>(ENDPOINTS.chats.create, data, {
    permission: 'Permissions.Team.Projects', // RBAC permission check
  });
}

export async function updateChat(
  id: string,
  data: Partial<ChatDto>,
): Promise<ApiResponse<ChatDto>> {
  return apiPut<ChatDto>(ENDPOINTS.chats.update(id), data, {
    permission: 'Permissions.Team.Projects', // RBAC permission check
  });
}

export async function deleteChat(id: string): Promise<ApiResponse<any>> {
  return apiDelete(ENDPOINTS.chats.delete(id), {
    permission: 'Permissions.Team.Projects', // RBAC permission check
  });
}

// Message Mutations
export async function sendMessage(
  data: Partial<ChatMessageDto>,
): Promise<ApiResponse<ChatMessageDto>> {
  return apiPost<ChatMessageDto>(ENDPOINTS.messages.create, data, {
    permission: 'Permissions.Team.Projects', // RBAC permission check
  });
}

export async function deleteMessage(id: string): Promise<ApiResponse<any>> {
  return apiDelete(ENDPOINTS.messages.delete(id), {
    permission: 'Permissions.Team.Projects', // RBAC permission check
  });
}

// Combined hook with mutations for convenience
export function useChatsWithMutations() {
  const chatsQuery = useChats();

  const mutations = {
    create: async (data: Partial<ChatDto>) => {
      const result = await createChat(data);
      chatsQuery.refetch(); // Refresh the list
      return result;
    },

    update: async (id: string, data: Partial<ChatDto>) => {
      const result = await updateChat(id, data);
      chatsQuery.refetch(); // Refresh the list
      return result;
    },

    delete: async (id: string) => {
      const result = await deleteChat(id);
      chatsQuery.refetch(); // Refresh the list
      return result;
    },
  };

  return {
    ...chatsQuery,
    mutations,
  };
}

// Combined hook for messages with mutations
export function useChatMessagesWithMutations(chatId: string) {
  const messagesQuery = useChatMessages({ chatId });

  const mutations = {
    send: async (data: Partial<ChatMessageDto>) => {
      const result = await sendMessage(data);
      messagesQuery.refetch(); // Refresh the list
      return result;
    },

    delete: async (id: string) => {
      const result = await deleteMessage(id);
      messagesQuery.refetch(); // Refresh the list
      return result;
    },
  };

  return {
    ...messagesQuery,
    mutations,
  };
}
