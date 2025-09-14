export interface ApiResponse<T = any> {
  status_code: number;
  data: T | null;
  message: string;
}
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

