/**
 * Standardized API response utilities for consistent response formats
 */

export interface SuccessResponse<T = any> {
  success: true
  data: T
  message?: string
  timestamp: string
}

export interface ErrorResponse {
  success: false
  error: string
  message: string
  timestamp: string
  details?: any[]
}

export interface PaginatedResponse<T = any> extends SuccessResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(
  data: T, 
  message?: string
): SuccessResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  }
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: string,
  message: string,
  details?: any[]
): ErrorResponse {
  return {
    success: false,
    error,
    message,
    timestamp: new Date().toISOString(),
    ...(details && { details })
  }
}

/**
 * Create a paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
  },
  message?: string
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    pagination: {
      ...pagination,
      hasMore: pagination.page * pagination.limit < pagination.total
    }
  }
}

/**
 * Legacy response format for backward compatibility
 * @deprecated Use createSuccessResponse instead
 */
export function createLegacyResponse<T>(data: T, message?: string) {
  return {
    success: true,
    ...data,
    ...(message && { message })
  }
}

/**
 * Legacy error format for backward compatibility  
 * @deprecated Use createErrorResponse instead
 */
export function createLegacyError(error: string, message: string) {
  return {
    error,
    message
  }
}