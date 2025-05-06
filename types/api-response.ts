export interface IApiError {
  code?: string;
  message: string;
  details?: unknown;
}

export interface IApiResponse<T> {
  succeeded: boolean;
  message: string;
  timestamp: string;
  data?: T;
  errors?: IApiError[];
}
