import { useFetch } from '@mantine/hooks';
import type { IApiResponse } from '@/types/api-response';
import type {
  InvoiceDto,
  ProjectDto,
  ProductDto,
  OrderDto,
  CustomerDto,
  EmailDto,
  NotificationDto,
  ChatDto,
  ChatMessageDto,
  TaskDto,
} from '@/types';

export type ApiResponse<T> = IApiResponse<T>;

// Generic hook for GET requests
export function useApiGet<T>(endpoint: string) {
  return useFetch<ApiResponse<T>>(endpoint);
}

// Hook for invoices
export function useInvoices() {
  return useApiGet<InvoiceDto[]>('/api/invoices');
}

// Hook for projects
export function useProjects() {
  return useApiGet<ProjectDto[]>('/api/projects');
}

// Hook for products
export function useProducts() {
  return useApiGet<ProductDto[]>('/api/products');
}

// Hook for orders
export function useOrders() {
  return useApiGet<OrderDto[]>('/api/orders');
}

// Hook for customers
export function useCustomers() {
  return useApiGet<CustomerDto[]>('/api/customers');
}

// Hook for emails
export function useEmails() {
  return useApiGet<EmailDto[]>('/api/emails');
}

// Hook for notifications
export function useNotifications() {
  return useApiGet<NotificationDto[]>('/api/notifications');
}

// Hook for sales
export function useSales() {
  return useApiGet<any[]>('/api/sales');
}

// Hook for stats
export function useStats() {
  return useApiGet<any[]>('/api/stats');
}

// Hook for traffic
export function useTraffic() {
  return useApiGet<any[]>('/api/traffic');
}

// Hook for tasks
export function useTasks() {
  return useApiGet<TaskDto[]>('/api/tasks');
}

// Hook for chat
export function useChats() {
  return useApiGet<ChatDto[]>('/api/chat');
}

// Hook for chat messages
export function useChatMessages() {
  return useApiGet<ChatMessageDto[]>('/api/chat/messages');
}

// Hook for profile
export function useProfile() {
  return useApiGet<any>('/api/profile');
}

// Hook for languages
export function useLanguages() {
  return useApiGet<any[]>('/api/languages');
}
