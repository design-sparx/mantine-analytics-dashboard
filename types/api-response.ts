export interface IApiError {
  code?: string;
  message: string;
  details?: unknown;
}

export interface IApiResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
  error?: IApiError[];
}
