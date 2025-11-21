import type { MockResponse } from '../types';

// Sample stats data
const mockStats = {
  revenue: {
    total: 125000,
    change: 12.5,
    trend: 'up' as const,
  },
  users: {
    total: 1250,
    change: 8.3,
    trend: 'up' as const,
  },
  orders: {
    total: 850,
    change: -2.1,
    trend: 'down' as const,
  },
  conversion: {
    rate: 3.24,
    change: 0.8,
    trend: 'up' as const,
  },
};

export const statsMockData = {
  overview: (): MockResponse<typeof mockStats> => ({
    succeeded: true,
    data: mockStats,
    errors: [],
    message: 'Mock stats retrieved successfully',
  }),
};
