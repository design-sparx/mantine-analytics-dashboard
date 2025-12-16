import { useFetch } from '@mantine/hooks';
import type { IApiResponse } from '@/types/api-response';

export type ApiResponse<T> = IApiResponse<T>;

// Generic hook for GET requests
export function useApiGet<T>(endpoint: string) {
  return useFetch<ApiResponse<T>>(endpoint);
}

// Hook for invoices
export function useInvoices() {
  return useApiGet('/api/invoices');
}

// Hook for projects
export function useProjects() {
  return useApiGet('/api/projects');
}

// Hook for products
export function useProducts() {
  return useApiGet('/api/products');
}

// Hook for orders
export function useOrders() {
  return useApiGet('/api/orders');
}

// Hook for sales
export function useSales() {
  return useApiGet('/api/sales');
}

// Hook for stats
export function useStats() {
  return useApiGet('/api/stats');
}

// Hook for traffic
export function useTraffic() {
  return useApiGet('/api/traffic');
}

// Hook for tasks
export function useTasks() {
  return useApiGet('/api/tasks');
}

// Hook for chat
export function useChats() {
  return useApiGet('/api/chat');
}

// Hook for chat messages
export function useChatMessages() {
  return useApiGet('/api/chat/messages');
}

// Hook for profile
export function useProfile() {
  return useApiGet('/api/profile');
}

// Hook for languages
export function useLanguages() {
  return useApiGet('/api/languages');
}
