export interface PaginatedResponse<T> {
  orders: T[];
  totalPages: number;
  totalElements: number;
}

export interface PaginatedRequestParams {
  id?: number;
  page?: number;
  pageSize?: number;
}

// Extend the Express session interface to include user ID
declare module "express" {
  interface Request {
    userId?: number;
  }
}
