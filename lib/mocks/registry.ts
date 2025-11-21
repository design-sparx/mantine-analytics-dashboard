import type { MockDataRegistry } from './types';
import { invoicesMockData } from './data/invoices.mock';
import { statsMockData } from './data/stats.mock';

/**
 * Central registry for all mock data
 * Maps endpoint patterns to mock response handlers
 */
export const mockDataRegistry: MockDataRegistry = {
  // Invoices endpoints
  '/api/v1/mantine/invoices': {
    GET: invoicesMockData.list(),
    POST: (data) => invoicesMockData.create(data),
  },

  // Invoice by ID (pattern matching handled in getMockData)
  '/api/v1/mantine/invoices/:id': {
    GET: null as any, // Will be handled dynamically
    PUT: (data) => null as any, // Will be handled dynamically
    DELETE: null as any, // Will be handled dynamically
  },

  // Stats endpoints
  '/api/v1/stats/overview': {
    GET: statsMockData.overview(),
  },

  // Add more endpoints here as needed
  // '/api/v1/products': { ... },
  // '/api/v1/orders': { ... },
};

/**
 * Get mock data for a given endpoint and HTTP method
 * Supports dynamic route parameters like /invoices/:id
 */
export function getMockData<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
): T | null {
  // First try exact match
  const exactMatch = mockDataRegistry[endpoint];
  if (exactMatch && exactMatch[method]) {
    const mockData = exactMatch[method];
    return typeof mockData === 'function' ? mockData(data) : mockData;
  }

  // Handle dynamic routes (e.g., /api/v1/mantine/invoices/123)
  // Extract ID from invoice endpoints
  const invoiceByIdMatch = endpoint.match(
    /^\/api\/v1\/mantine\/invoices\/(.+)$/,
  );
  if (invoiceByIdMatch) {
    const id = invoiceByIdMatch[1];
    switch (method) {
      case 'GET':
        return invoicesMockData.byId(id) as T;
      case 'PUT':
        return invoicesMockData.update(id, data) as T;
      case 'DELETE':
        return invoicesMockData.delete(id) as T;
    }
  }

  // Add more dynamic route handlers here as needed
  // Example:
  // const productByIdMatch = endpoint.match(/^\/api\/v1\/products\/(.+)$/);
  // if (productByIdMatch) { ... }

  return null;
}

/**
 * Check if an endpoint has mock data available
 */
export function hasMockData(endpoint: string): boolean {
  // Check exact match
  if (mockDataRegistry[endpoint]) {
    return true;
  }

  // Check dynamic routes
  if (endpoint.match(/^\/api\/v1\/mantine\/invoices\/.+$/)) {
    return true;
  }

  // Add more pattern checks as needed

  return false;
}
