/**
 * Common DTOs and utility types used across the application
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  issues?: ValidationError[];
}

/**
 * Zod validation error item
 */
export interface ValidationError {
  code: string;
  expected?: string;
  received?: string;
  path: (string | number)[];
  message: string;
}

/**
 * Paginated response for list endpoints
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count?: number;
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

/**
 * Query parameters for pagination
 */
export interface PaginationQuery {
  limit?: number;
  offset?: number;
}

/**
 * Health check response
 */
export interface HealthData {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
}

export interface HealthResponse extends ApiResponse<HealthData> {}
