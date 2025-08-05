export interface ApiResponse<T> {
  statusCode: number;
  data: T | null;
  error: string | { code: string; details?: any } | null;
  success: boolean;
  message: string;
}
