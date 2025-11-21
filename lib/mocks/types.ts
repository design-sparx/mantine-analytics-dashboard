import type { ApiResponse } from '@/lib/endpoints/api-utils';

export type MockResponse<T> = ApiResponse<T>;

export interface MockDataRegistry {
  [endpoint: string]: {
    GET?: MockResponse<any>;
    POST?: (data?: any) => MockResponse<any>;
    PUT?: (data?: any) => MockResponse<any>;
    DELETE?: MockResponse<any>;
  };
}
