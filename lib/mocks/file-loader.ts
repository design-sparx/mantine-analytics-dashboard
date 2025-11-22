import type { ApiResponse } from '@/lib/endpoints/api-utils';

/**
 * Mock data file mappings
 * Maps endpoint patterns to their corresponding JSON files in public/mocks/
 */
export interface MockFileMapping {
  endpoint: string;
  file: string;
  isArray?: boolean; // If true, data is an array. If false or undefined, data is wrapped in { data: ... }
}

export const mockFileMappings: MockFileMapping[] = [
  // Invoices
  {
    endpoint: '/api/v1/mantine/invoices',
    file: '/mocks/Invoices.json',
    isArray: true,
  },

  // Orders
  {
    endpoint: '/api/v1/mantine/orders',
    file: '/mocks/Orders.json',
    isArray: true,
  },

  // Projects
  {
    endpoint: '/api/v1/mantine/projects',
    file: '/mocks/Projects.json',
    isArray: true,
  },

  // Stats
  {
    endpoint: '/api/v1/stats/overview',
    file: '/mocks/StatsGrid.json',
    isArray: false, // This one has { data: [...] } structure
  },

  // Sales
  {
    endpoint: '/api/v1/sales',
    file: '/mocks/Sales.json',
    isArray: false,
  },

  // Traffic
  {
    endpoint: '/api/v1/traffic',
    file: '/mocks/Traffic.json',
    isArray: true,
  },

  // Kanban tasks
  {
    endpoint: '/api/v1/kanban/tasks',
    file: '/mocks/KanbanTasks.json',
    isArray: true,
  },

  // Languages
  {
    endpoint: '/api/v1/languages',
    file: '/mocks/Languages.json',
    isArray: true,
  },

  // Chat
  {
    endpoint: '/api/v1/chat/items',
    file: '/mocks/ChatItems.json',
    isArray: true,
  },
  {
    endpoint: '/api/v1/chat/list',
    file: '/mocks/ChatsList.json',
    isArray: true,
  },

  // Files
  {
    endpoint: '/api/v1/files',
    file: '/mocks/Files.json',
    isArray: true,
  },
  {
    endpoint: '/api/v1/folders',
    file: '/mocks/Folders.json',
    isArray: true,
  },
  {
    endpoint: '/api/v1/files/activities',
    file: '/mocks/FileActivities.json',
    isArray: true,
  },

  // User profile
  {
    endpoint: '/api/v1/profile',
    file: '/mocks/UserProfile.json',
    isArray: false,
  },
];

/**
 * Get the mock file path for an endpoint
 */
export function getMockFilePath(endpoint: string): string | null {
  // Try exact match first
  const exactMatch = mockFileMappings.find((m) => m.endpoint === endpoint);
  if (exactMatch) {
    return exactMatch.file;
  }

  // Check for dynamic routes (e.g., /api/v1/mantine/invoices/123)
  // For single item requests, return the same collection file
  // The item will be filtered by ID in the API utilities
  for (const mapping of mockFileMappings) {
    if (endpoint.startsWith(mapping.endpoint + '/')) {
      return mapping.file;
    }
  }

  return null;
}

/**
 * Get mapping info for an endpoint
 */
export function getMockMapping(endpoint: string): MockFileMapping | null {
  // Try exact match first
  const exactMatch = mockFileMappings.find((m) => m.endpoint === endpoint);
  if (exactMatch) {
    return exactMatch;
  }

  // Check for dynamic routes
  for (const mapping of mockFileMappings) {
    if (endpoint.startsWith(mapping.endpoint + '/')) {
      return mapping;
    }
  }

  return null;
}

/**
 * Check if an endpoint has a mock file
 */
export function hasMockFile(endpoint: string): boolean {
  return getMockFilePath(endpoint) !== null;
}

/**
 * Fetch mock data from JSON file
 */
export async function fetchMockData<T>(
  endpoint: string,
): Promise<ApiResponse<T>> {
  const filePath = getMockFilePath(endpoint);

  if (!filePath) {
    return {
      succeeded: false,
      data: null as any,
      errors: ['No mock data available for this endpoint'],
      message: 'Mock data not found',
    };
  }

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Failed to load mock data: ${response.statusText}`);
    }

    const data = await response.json();
    const mapping = getMockMapping(endpoint);

    // Check if this is a request for a specific item (has an ID in the URL)
    const idMatch = endpoint.match(/\/([^/]+)$/);
    if (idMatch && mapping?.isArray) {
      // Extract item by ID
      const id = idMatch[1];
      const items = Array.isArray(data) ? data : data.data || [];
      const item = items.find((item: any) => item.id === id);

      if (!item) {
        return {
          succeeded: false,
          data: null as any,
          errors: ['Item not found'],
          message: 'Item not found',
        };
      }

      return {
        succeeded: true,
        data: item as T,
        errors: [],
        message: 'Mock data loaded successfully',
      };
    }

    // Return the data based on structure
    if (mapping?.isArray === false && data.data !== undefined) {
      // Data is wrapped in { data: ... }
      return {
        succeeded: true,
        data: data.data as T,
        errors: [],
        message: 'Mock data loaded successfully',
      };
    }

    // Data is a direct array or object
    return {
      succeeded: true,
      data: data as T,
      errors: [],
      message: 'Mock data loaded successfully',
    };
  } catch (error) {
    console.error('Error loading mock data:', error);
    return {
      succeeded: false,
      data: null as any,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      message: 'Failed to load mock data',
    };
  }
}

/**
 * Simulate mock mutations (create, update, delete)
 * These return success but don't persist data
 */
export async function mockMutation<T>(
  method: 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
): Promise<ApiResponse<T>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  switch (method) {
    case 'POST':
      return {
        succeeded: true,
        data: { ...data, id: `mock-${Date.now()}` } as T,
        errors: [],
        message: 'Mock item created successfully (not persisted)',
      };

    case 'PUT':
      return {
        succeeded: true,
        data: data as T,
        errors: [],
        message: 'Mock item updated successfully (not persisted)',
      };

    case 'DELETE':
      return {
        succeeded: true,
        data: { success: true } as T,
        errors: [],
        message: 'Mock item deleted successfully (not persisted)',
      };

    default:
      return {
        succeeded: false,
        data: null as any,
        errors: ['Unsupported method'],
        message: 'Unsupported method',
      };
  }
}
